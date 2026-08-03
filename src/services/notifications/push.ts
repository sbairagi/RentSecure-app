export function initNotifications() {
  try {
    const expoNotifications = require('expo-notifications');
    expoNotifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {
    console.warn('expo-notifications not available');
  }
}
