import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onClear,
  disabled = false,
  containerStyle,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.neutral[200],
          backgroundColor: theme.colors.neutral[50],
        },
        containerStyle,
      ]}
    >
      <Text style={[styles.icon, { color: theme.colors.neutral[400] }]}>🔍</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.neutral[900] }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.neutral[400]}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} style={styles.clearButton}>
          <Text style={[styles.clearText, { color: theme.colors.neutral[500] }]}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: 14,
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
