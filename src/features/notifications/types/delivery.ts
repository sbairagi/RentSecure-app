export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'retrying' | 'permanent_failed';
export type MessageType = 'text' | 'audio' | 'file';

export interface DeliveryLog {
  id: number;
  channel: 'whatsapp' | 'sms' | 'email' | 'push';
  message_type: MessageType;
  status: DeliveryStatus;
  recipient: string;
  content_preview: string;
  sent_at: string;
  delivered_at?: string;
  failed_at?: string;
  retry_count: number;
  error_message?: string;
  media_url?: string;
  rent_record_id?: number;
  user_id?: number;
}

export interface DeliveryStats {
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  delivery_rate: number;
  by_channel: Record<string, { sent: number; delivered: number; failed: number }>;
}
