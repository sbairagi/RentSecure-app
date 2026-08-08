declare module 'expo-router' {
  import { Router } from 'expo-router/build/Route';
  export function useRouter(): Router & {
    push: (path: string) => void;
    replace: (path: string) => void;
  };
  export function useLocalSearchParams<T = Record<string, string | undefined>>(): T;
}
