import { AppInput } from '@/components/common/AppInput';
import { AppText } from '@/components/common/AppText';
import { FormField } from '@/components/forms/FormField';
import { Radius, Spacing } from '@/constants/theme';
import { Button } from '@/design-system/buttons/Button';
import { useBuildings } from '@/features/buildings/hooks/useBuildings';
import { useIsOffline } from '@/core/offline';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/authStore';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { ApiError } from '@/services/api/errorHandler';

type FormValues = {
  name: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

export default function AddBuildingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const isOffline = useIsOffline();
  const user = useAuthStore((s) => s.user);
  const { createBuildingAsync, isCreating } = useBuildings(user?.id);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      address_line: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const created = await createBuildingAsync(data);
      reset();
      if (created) {
        router.replace(`/(drawer)/(tabs)/buildings/${created.id}`);
      } else {
        router.back();
      }
    } catch (err: any) {
      const apiError = err instanceof ApiError ? err : null;
      if (apiError?.details) {
        Object.entries(apiError.details).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : String(messages);
          control.setError(field as keyof FormValues, { message });
        });
      }
    }
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['building:write']}>
        <View testID="add-building.screen" style={[styles.container, { backgroundColor: theme.background }]}>
          <AppText style={[styles.title, { color: theme.text }]}>Add Building</AppText>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <FormField label="Building Name" required error={errors.name?.message}>
              <AppInput
                testID="add-building.name"
                control={control as any}
                name="name"
                placeholder="Enter building name"
                error={errors.name?.message}
                rules={{
                  required: 'Building name is required',
                  maxLength: { value: 255, message: 'Building name must be at most 255 characters' },
                }}
              />
            </FormField>
            <FormField label="Address" required error={errors.address_line?.message}>
              <AppInput
                testID="add-building.address"
                control={control as any}
                name="address_line"
                placeholder="Street address"
                error={errors.address_line?.message}
                rules={{
                  required: 'Address is required',
                  maxLength: { value: 255, message: 'Address must be at most 255 characters' },
                }}
              />
            </FormField>
            <FormField label="City" required error={errors.city?.message}>
              <AppInput
                testID="add-building.city"
                control={control as any}
                name="city"
                placeholder="City"
                error={errors.city?.message}
                rules={{
                  required: 'City is required',
                  maxLength: { value: 100, message: 'City must be at most 100 characters' },
                }}
              />
            </FormField>
            <FormField label="State" required error={errors.state?.message}>
              <AppInput
                testID="add-building.state"
                control={control as any}
                name="state"
                placeholder="State"
                error={errors.state?.message}
                rules={{
                  required: 'State is required',
                  maxLength: { value: 100, message: 'State must be at most 100 characters' },
                }}
              />
            </FormField>
            <FormField label="Country" required error={errors.country?.message}>
              <AppInput
                testID="add-building.country"
                control={control as any}
                name="country"
                placeholder="Country"
                error={errors.country?.message}
                rules={{
                  required: 'Country is required',
                  maxLength: { value: 100, message: 'Country must be at most 100 characters' },
                }}
              />
            </FormField>
            <FormField label="Postal Code" required error={errors.postal_code?.message}>
              <AppInput
                testID="add-building.postalCode"
                control={control as any}
                name="postal_code"
                placeholder="ZIP / Postal code"
                error={errors.postal_code?.message}
                rules={{
                  required: 'Postal code is required',
                  maxLength: { value: 10, message: 'Postal code must be at most 10 characters' },
                }}
              />
            </FormField>
            <Button
              testID="add-building.submit"
              title={isCreating ? 'Saving...' : 'Save Building'}
              onPress={handleSubmit(onSubmit)}
              disabled={isCreating || isOffline}
            />
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    margin: Spacing.md,
  },
  card: {
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
});
