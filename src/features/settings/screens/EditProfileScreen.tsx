import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import { useProfile, useUpdateProfile } from '../hooks';

export default function EditProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const initialValues = useMemo(() => {
    if (!profile) return { fullName: '', email: '', phone: '' };
    return {
      fullName: profile.full_name || '',
      email: profile.email || '',
      phone: profile.phone || '',
    };
  }, [profile]);

  const [fullName, setFullName] = useState(initialValues.fullName);
  const [email, setEmail] = useState(initialValues.email);
  const [phone, setPhone] = useState(initialValues.phone);
  const [error, setError] = useState<string | null>(null);

  if (profileLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  const handleSave = () => {
    setError(null);
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    updateProfile({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Edit Profile</Text>
          <Button
            mode="text"
            onPress={handleSave}
            loading={isPending}
            disabled={isPending}
            textColor={theme.colors.primary}
          >
            Save
          </Button>
        </View>

        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
            <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
            disabled={isPending}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            disabled={isPending}
          />
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            disabled={isPending}
          />
        </View>
      </View>
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
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    marginBottom: 16,
  },
});
