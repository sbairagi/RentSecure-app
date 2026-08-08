import { useRouter } from 'expo-router';

export function useSubscriptionRouter() {
  const router = useRouter();
  
  const push = (path: string) => {
    router.push(path as any);
  };
  
  const replace = (path: string) => {
    router.replace(path as any);
  };
  
  const back = () => {
    router.back();
  };
  
  return {
    ...router,
    push,
    replace,
    back,
  };
}
