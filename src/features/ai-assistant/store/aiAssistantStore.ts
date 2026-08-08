import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, Conversation, AIState, AIErrorCode } from '../types';

interface AIAssistantActions {
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  setCurrentConversationId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setTyping: (isTyping: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null, code?: AIErrorCode | null) => void;
  clearError: () => void;
  setSuggestedQuestions: (questions: string[]) => void;
  setHasMoreMessages: (hasMore: boolean) => void;
  reset: () => void;
}

const initialState: AIState = {
  messages: [],
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  isTyping: false,
  isProcessing: false,
  error: null,
  errorCode: null,
  suggestedQuestions: [],
  hasMoreMessages: false,
};

export type AIAssistantStore = AIState & AIAssistantActions;

export const useAIAssistantStore = create<AIAssistantStore>()(
  persist(
    (set) => ({
      ...initialState,

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),

      setMessages: (messages) => set({ messages }),

      clearMessages: () => set({ messages: [] }),

      setConversations: (conversations) => set({ conversations }),

      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        })),

      removeConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          messages: state.messages.filter((m) => m.conversation_id !== id),
          currentConversationId:
            state.currentConversationId === id ? null : state.currentConversationId,
        })),

      setCurrentConversationId: (currentConversationId) =>
        set({ currentConversationId }),

      setLoading: (isLoading) => set({ isLoading }),

      setTyping: (isTyping) => set({ isTyping }),

      setProcessing: (isProcessing) => set({ isProcessing }),

      setError: (error, errorCode = null) => set({ error, errorCode }),

      clearError: () => set({ error: null, errorCode: null }),

      setSuggestedQuestions: (suggestedQuestions) =>
        set({ suggestedQuestions }),

      setHasMoreMessages: (hasMoreMessages) =>
        set({ hasMoreMessages }),

      reset: () => set(initialState),
    }),
    {
      name: 'ai-assistant-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);
