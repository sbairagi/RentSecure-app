import { Redirect } from 'expo-router';

export default function OldTabsLayout() {
  return <Redirect href="/(drawer)/(tabs)/dashboard" />;
}
