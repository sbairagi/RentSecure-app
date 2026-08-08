import { useQuery, useQueryClient } from '@tanstack/react-query';
import { limitService } from '../services/limitService';
import { useSubscriptionFeatureStore } from '../store/subscriptionStore';
import { useCurrentSubscription } from './useCurrentSubscription';
import { useAddOns } from './useAddOns';
import { useUsageLimits } from './useUsageLimits';
import { SUBSCRIPTION_CONSTANTS } from '../constants';
import type { PlanFeatureLimit } from '../types';

const ALL_FEATURE_KEYS = [
  'max_buildings',
  'max_units',
  'max_renters',
  'max_caretakers',
  'max_unit_images',
  'max_document_uploads',
  'tax_notifications',
  'whatsapp_alerts',
  'rent_agreement_drafting',
  'export_pdf_dossier',
] as const;

export function useEffectiveLimits() {
  const { data: subscription } = useCurrentSubscription();
  const { data: addOns } = useAddOns();
  const { data: usageLimits } = useUsageLimits();
  const { setFeatureLimits, setEffectiveLimits } = useSubscriptionFeatureStore();

  return useQuery({
    queryKey: ['subscription', 'effectiveLimits'],
    queryFn: () => {
      const featureLimits: PlanFeatureLimit[] = [];
      const plan = subscription?.plan;
      
       const effectiveLimits = limitService.computeAllEffectiveLimits(
         featureLimits,
         addOns ?? [],
         plan ?? null,
         usageLimits ?? [],
         [...ALL_FEATURE_KEYS]
       );
      
      setFeatureLimits(featureLimits);
      setEffectiveLimits(effectiveLimits);
      return effectiveLimits;
    },
    enabled: !!subscription || (addOns !== undefined && usageLimits !== undefined),
    staleTime: SUBSCRIPTION_CONSTANTS.CACHE.USAGE_LIMITS_STALE_TIME,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useRefreshEffectiveLimits() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['subscription', 'effectiveLimits'] });
}
