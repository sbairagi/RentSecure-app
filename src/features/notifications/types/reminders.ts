export type ReminderType = 'rent' | 'tax' | 'itr' | 'extra_charge';
export type ReminderStatus = 'scheduled' | 'sent' | 'failed' | 'retrying' | 'permanent_failed';

export interface Reminder {
  id: number;
  type: ReminderType;
  title: string;
  message: string;
  scheduled_at: string;
  sent_at?: string;
  status: ReminderStatus;
  delivery_channel: string;
  delivery_result: 'delivered' | 'failed' | 'pending';
  retry_count: number;
  max_retries: number;
  last_retry_at?: string;
  error_message?: string;
  user_id?: number;
  renter_name?: string;
  unit_name?: string;
  amount?: number;
  due_date?: string;
  rent_record_id?: number;
}

export interface ReminderFilters {
  type?: ReminderType | 'all';
  status?: ReminderStatus | 'all';
  date_from?: string;
  date_to?: string;
}
