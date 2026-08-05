import { apiService } from '@/services/api/apiClient';
import { useRouter } from 'expo-router';
import React from 'react';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const router = useRouter();

  React.useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await apiService
          .get<{ isMaintenance: boolean; message?: string }>('/auth/maintenance/')
          .catch(() => ({ isMaintenance: false }) as any);

        const data = (res as any)?.isMaintenance !== undefined ? res : { isMaintenance: false };
        if (data.isMaintenance) {
          router.replace('/(auth)/maintenance');
        }
      } catch {
        // Continue if check fails
      }
    };

    checkMaintenance();
  }, [router]);

  return <>{children}</>;
}
