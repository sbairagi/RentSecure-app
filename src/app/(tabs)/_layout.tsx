import { Redirect, usePathname } from 'expo-router';

export default function OldTabsLayout() {
  const pathname = usePathname();

  if (pathname === '/(drawer)/(tabs)/dashboard') return null;

  return <Redirect href="/(drawer)/(tabs)/dashboard" />;
}
