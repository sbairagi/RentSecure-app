// @ts-nocheck
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationCard } from '../../components/NotificationCard';
import { PaperProvider } from 'react-native-paper';

const mockNotification = {
  id: 1,
  title: 'Test Notification',
  message: 'This is a test notification message',
  is_read: false,
  created_at: new Date().toISOString(),
  type: 'rent_due',
  priority: 'high',
  channels: ['push', 'whatsapp'] as any[],
};

describe('NotificationCard', () => {
  it('renders correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PaperProvider>
        <NotificationCard notification={mockNotification} onPress={onPress} />
      </PaperProvider>
    );
    expect(getByText('Test Notification')).toBeTruthy();
    expect(getByText('This is a test notification message')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PaperProvider>
        <NotificationCard notification={mockNotification} onPress={onPress} />
      </PaperProvider>
    );
    fireEvent.press(getByText('Test Notification'));
    expect(onPress).toHaveBeenCalledWith(mockNotification);
  });

  it('shows priority badge for high priority', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PaperProvider>
        <NotificationCard notification={mockNotification} onPress={onPress} />
      </PaperProvider>
    );
    expect(getByText('High')).toBeTruthy();
  });

  it('shows unread badge for unread notifications', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PaperProvider>
        <NotificationCard notification={mockNotification} onPress={onPress} />
      </PaperProvider>
    );
    expect(getByText('NEW')).toBeTruthy();
  });
});
