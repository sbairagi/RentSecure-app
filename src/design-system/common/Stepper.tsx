import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, spacing } from '../tokens';

export interface StepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  onStepPress?: (step: number) => void;
  style?: ViewStyle;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepPress, style }) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const _isUpcoming = index > currentStep;

        return (
          <React.Fragment key={index}>
            <Pressable
              onPress={() => onStepPress?.(index)}
              style={styles.stepContainer}
              disabled={!onStepPress}
            >
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor:
                      isCompleted || isCurrent
                        ? theme.colors.primary[600]
                        : theme.colors.neutral[200],
                    borderColor:
                      isCompleted || isCurrent
                        ? theme.colors.primary[600]
                        : theme.colors.neutral[300],
                  },
                ]}
              >
                {isCompleted ? (
                  <Text style={[styles.stepText, { color: colors.white }]}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepText,
                      { color: isCurrent ? colors.white : theme.colors.neutral[500] },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <View style={styles.stepContent}>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: isCurrent ? theme.colors.neutral[900] : theme.colors.neutral[500],
                    },
                  ]}
                >
                  {step.label}
                </Text>
                {step.description && (
                  <Text
                    style={[styles.stepDescription, { color: theme.colors.neutral[400] }]}
                    numberOfLines={2}
                  >
                    {step.description}
                  </Text>
                )}
              </View>
            </Pressable>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      index < currentStep ? theme.colors.primary[600] : theme.colors.neutral[200],
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    alignItems: 'center',
    maxWidth: 80,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  line: {
    flex: 1,
    height: 2,
    marginTop: 16,
    marginHorizontal: spacing.xs,
  },
});
