import { AppInput } from '@/components/common/AppInput';
import { AppText } from '@/components/common/AppText';
import { FormField } from '@/components/forms/FormField';
import { Radius, Spacing } from '@/constants/theme';
import { Button } from '@/design-system/buttons/Button';
import { useBuildings } from '@/features/buildings/hooks/useBuildings';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

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
  const { createBuilding, isCreating } = useBuildings();
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
    await createBuilding(data);
    reset();
    router.back();
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['building:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <AppText style={[styles.title, { color: theme.text }]}>Add Building</AppText>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <FormField label="Building Name" required error={errors.name?.message}>
              <AppInput
                control={control as any}
                name="name"
                placeholder="Enter building name"
                error={errors.name?.message}
              />
            </FormField>
            <FormField label="Address" required error={errors.address_line?.message}>
              <AppInput
                control={control as any}
                name="address_line"
                placeholder="Street address"
                error={errors.address_line?.message}
              />
            </FormField>
            <FormField label="City" required error={errors.city?.message}>
              <AppInput
                control={control as any}
                name="city"
                placeholder="City"
                error={errors.city?.message}
              />
            </FormField>
            <FormField label="State" required error={errors.state?.message}>
              <AppInput
                control={control as any}
                name="state"
                placeholder="State"
                error={errors.state?.message}
              />
            </FormField>
            <FormField label="Country" required error={errors.country?.message}>
              <AppInput
                control={control as any}
                name="country"
                placeholder="Country"
                error={errors.country?.message}
              />
            </FormField>
            <FormField label="Postal Code" required error={errors.postal_code?.message}>
              <AppInput
                control={control as any}
                name="postal_code"
                placeholder="ZIP / Postal code"
                error={errors.postal_code?.message}
              />
            </FormField>
            <Button
              title={isCreating ? 'Saving...' : 'Save Building'}
              onPress={handleSubmit(onSubmit)}
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
