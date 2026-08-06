import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  type FlatListProps,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface FlashListWrapperProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: ListRenderItem<T>;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  estimatedItemSize?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
}

export function FlashListWrapper<T>({
  data,
  renderItem,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  estimatedItemSize = 80,
  contentContainerStyle,
  onRefresh,
  refreshing = false,
  ListHeaderComponent,
  ListFooterComponent,
  ...rest
}: FlashListWrapperProps<T>) {
  const theme = useDesignSystemTheme();

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.neutral[400] }]}>{emptyMessage}</Text>
      </View>
    );
  }, [loading, emptyMessage, theme]);

  const renderError = useCallback(() => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>{error}</Text>
      </View>
    );
  }, [error, theme]);

  const renderFooter = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary[600]} />
        </View>
      );
    }
    return ListFooterComponent || null;
  }, [loading, theme, ListFooterComponent]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => String(index)}
      contentContainerStyle={[contentContainerStyle, data.length === 0 && styles.emptyContent]}
      ListEmptyComponent={error ? renderError : renderEmpty}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter()}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary[600]}
          />
        ) : undefined
      }
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  emptyContent: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  errorText: {
    fontSize: 14,
  },
  loadingContainer: {
    paddingVertical: spacing.md,
  },
});
