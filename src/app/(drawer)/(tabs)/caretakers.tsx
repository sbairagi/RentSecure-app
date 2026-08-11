import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function CaretakersTabScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(drawer)/(tabs)/caretakers/list');
  }, [router]);

  return null;
}
