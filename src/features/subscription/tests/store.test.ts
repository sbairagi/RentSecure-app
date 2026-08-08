import { useSubscriptionFeatureStore } from '../store/subscriptionStore';

describe('subscriptionStore', () => {
  beforeEach(() => {
    useSubscriptionFeatureStore.setState({
      subscription: null,
      plans: [],
      addOns: [],
      usageLimits: [],
      featureLimits: [],
      effectiveLimits: [],
      isLoading: false,
      error: null,
      lastUpdated: 0,
    });
  });

  it('initializes with default state', () => {
    const state = useSubscriptionFeatureStore.getState();
    expect(state.subscription).toBeNull();
    expect(state.plans).toEqual([]);
    expect(state.addOns).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it('sets subscription correctly', () => {
    const mockSubscription = {
      id: 1,
      user: 1,
      plan: { id: 1, name: 'pro', monthly_price: '999', yearly_price: '9999', features: '', is_active: true },
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      is_active: true,
      is_yearly: false,
      tax_reminder_days_before: 7,
      rent_reminder_days_before: 7,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    } as any;
    useSubscriptionFeatureStore.getState().setSubscription(mockSubscription);
    expect(useSubscriptionFeatureStore.getState().subscription).toEqual(mockSubscription);
    expect(useSubscriptionFeatureStore.getState().isLoading).toBe(false);
  });

  it('sets plans correctly', () => {
    const mockPlans = [
      { id: 1, name: 'free', monthly_price: '0', yearly_price: '0', features: '', is_active: true },
    ] as any[];
    useSubscriptionFeatureStore.getState().setPlans(mockPlans);
    expect(useSubscriptionFeatureStore.getState().plans).toEqual(mockPlans);
  });

  it('sets add-ons correctly', () => {
    const mockAddOns = [
      { id: 1, user: 1, name: 'max_buildings', amount: '5', is_recurring: true, purchase_date: '2024-01-01' },
    ] as any[];
    useSubscriptionFeatureStore.getState().setAddOns(mockAddOns);
    expect(useSubscriptionFeatureStore.getState().addOns).toEqual(mockAddOns);
  });

  it('clears subscription correctly', () => {
    useSubscriptionFeatureStore.getState().setSubscription({ id: 1 } as any);
    useSubscriptionFeatureStore.getState().clearSubscription();
    expect(useSubscriptionFeatureStore.getState().subscription).toBeNull();
    expect(useSubscriptionFeatureStore.getState().plans).toEqual([]);
  });

  it('sets error correctly', () => {
    useSubscriptionFeatureStore.getState().setError('Test error');
    expect(useSubscriptionFeatureStore.getState().error).toBe('Test error');
    expect(useSubscriptionFeatureStore.getState().isLoading).toBe(false);
  });
});
