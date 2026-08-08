import React, { useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAIChat } from '../hooks';
import { useSuggestedQuestions } from '../hooks';
import { useAIAssistantStore } from '../store';
import {
  ChatMessage,
  TypingIndicator,
  SuggestedQuestions,
  ChatInput,
  ErrorState,
  EmptyState,
  UpgradePrompt,
} from '../components';
import { shouldShowUpgradePrompt, getAIErrorUserMessage } from '../utils';
import { SubscriptionGuardWrapper } from '@/features/subscription/components/SubscriptionGuardWrapper';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';

export default function AIAssistantScreen() {
  const theme = useTheme();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    currentConversationId,
    isLoading,
    isTyping,
    isProcessing,
    error,
    errorCode,
    suggestedQuestions,
    hasMoreMessages,
  } = useAIAssistantStore();

  const { sendMessage, retryMessage, isLoading: isSending } = useAIChat();
  const { data: suggestedQuestionsData, refetch: refetchQuestions } =
    useSuggestedQuestions();

  const displayQuestions =
    suggestedQuestionsData?.length ? suggestedQuestionsData : suggestedQuestions;

  useEffect(() => {
    refetchQuestions();
  }, [refetchQuestions]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isTyping]);

  const handleSend = useCallback(
    async (message: string) => {
      await sendMessage({ message, conversationId: currentConversationId || undefined });
    },
    [sendMessage, currentConversationId]
  );

  const handleRetry = useCallback(
    async (messageId: string) => {
      const message = messages.find((m) => m.id === messageId);
      if (message && message.role === 'user') {
        await retryMessage({
          message: message.content,
          conversationId: message.conversation_id,
        });
      }
    },
    [retryMessage, messages]
  );

  const handleSuggestedQuestion = useCallback(
    (question: string) => {
      handleSend(question);
    },
    [handleSend]
  );

  const handleClearConversation = useCallback(() => {
    useAIAssistantStore.getState().clearMessages();
    useAIAssistantStore.getState().setCurrentConversationId(null);
  }, []);

  const renderMessage = useCallback(
    ({ item }: { item: any }) => {
      if (item.role === 'user') {
        return <ChatMessage key={item.id} message={item} />;
      }
      return (
        <ChatMessage
          key={item.id}
          message={item}
          onRetry={
            item.is_error && item.role === 'user'
              ? () => handleRetry(item.id)
              : undefined
          }
        />
      );
    },
    [handleRetry]
  );

  const renderTypingIndicator = useCallback(() => {
    if (isTyping || isProcessing) {
      return <TypingIndicator message={isProcessing ? 'Processing...' : undefined} />;
    }
    return null;
  }, [isTyping, isProcessing]);

  const renderError = useCallback(() => {
    if (!error) return null;
    return (
      <ErrorState
        message={getAIErrorUserMessage(errorCode)}
        onRetry={() => useAIAssistantStore.getState().clearError()}
      />
    );
  }, [error, errorCode]);

  const renderSuggestedQuestions = useCallback(() => {
    if (messages.length > 0 || isTyping || isProcessing) return null;
    return (
      <SuggestedQuestions
        questions={displayQuestions}
        onSelect={handleSuggestedQuestion}
        disabled={isSending}
      />
    );
  }, [messages.length, isTyping, isProcessing, displayQuestions, handleSuggestedQuestion, isSending]);

  const renderEmptyState = useCallback(() => {
    if (messages.length > 0) return null;
    return (
      <EmptyState
        title="AI Assistant"
        description="Ask me anything about your properties, renters, payments, and more."
        actionLabel="Clear Conversation"
        onAction={handleClearConversation}
      />
    );
  }, [messages.length, handleClearConversation]);

  const renderUpgradePrompt = useCallback(() => {
    if (!shouldShowUpgradePrompt(errorCode)) return null;
    return <UpgradePrompt onUpgrade={() => router.push('/(drawer)/(tabs)/subscription')} />;
  }, [errorCode, router]);

  if (shouldShowUpgradePrompt(errorCode)) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['ai:read']}>
          <SubscriptionGuardWrapper
            fallback={
              <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {renderUpgradePrompt()}
              </View>
            }
          >
            <View />
          </SubscriptionGuardWrapper>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['ai:read']}>
        <SubscriptionGuardWrapper
          fallback={
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
              {renderUpgradePrompt()}
            </View>
          }
        >
          <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.headerLeft}>
                <MaterialCommunityIcons
                  name="robot"
                  size={28}
                  color={theme.colors.primary}
                />
                <View>
                  <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
                    AI Assistant
                  </Text>
                  <Text
                    style={[
                      styles.headerSubtitle,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Ask anything about your properties
                  </Text>
                </View>
              </View>
              {messages.length > 0 && (
                <IconButton
                  icon="delete-outline"
                  size={20}
                  onPress={handleClearConversation}
                  iconColor={theme.colors.error}
                />
              )}
            </View>

            <FlatList
              ref={flatListRef}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyState}
              ListFooterComponent={
                <View>
                  {renderSuggestedQuestions()}
                  {renderTypingIndicator()}
                  {renderError()}
                </View>
              }
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />

            <ChatInput
              onSend={handleSend}
              disabled={isSending || isProcessing}
              placeholder="Ask AI anything..."
            />
          </KeyboardAvoidingView>
        </SubscriptionGuardWrapper>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 12,
    marginLeft: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
});
