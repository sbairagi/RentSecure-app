export interface NotificationPreferences {
  rent_alerts_whatsapp: boolean;
  rent_alerts_email: boolean;
  monthly_summary_email: boolean;
  monthly_summary_whatsapp: boolean;
  payout_alerts_whatsapp: boolean;
  payout_alerts_email: boolean;
  receive_rent_alerts: boolean;
  receive_tax_alerts: boolean;
  receive_vacancy_alerts: boolean;
  receive_flagged_alerts: boolean;
  receive_voice_alerts: boolean;
  language_preference: string;
  alert_frequency: string;
  greeting_prefix: string;
  reminder_time: string;
  rent_reminders_enabled: boolean;
}

export interface UserPreferences {
  whatsapp_opt_in: boolean;
  whatsapp_number: string;
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}
