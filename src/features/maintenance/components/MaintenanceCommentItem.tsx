import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface MaintenanceCommentItemProps {
  authorName: string;
  text: string;
  createdAt: string;
}

export const MaintenanceCommentItem: React.FC<MaintenanceCommentItemProps> = ({
  authorName,
  text,
  createdAt,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: theme.primary }]}>
            {authorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.author, { color: theme.text }]}>{authorName}</Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {new Date(createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
      <Text style={[styles.text, { color: theme.text }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerText: {
    flex: 1,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
