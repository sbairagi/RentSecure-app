import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function AIAssistantTabScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(drawer)/(tabs)/ai-assistant/chat');
  }, [router]);

  return null;
}
