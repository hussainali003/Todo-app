/* eslint-disable no-undef */
import { cancelTaskNotification } from '../utils/notificationUtils';
import * as Notifications from 'expo-notifications';

jest.mock('expo-notifications');

test('cancels notification if notificationId exists', async () => {
  const task = { id: '1', notificationId: '123' };

  await cancelTaskNotification(task);

  expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('123');
});

test('does not throw if notificationId is missing', async () => {
  const task = { id: '2' };

  await expect(cancelTaskNotification(task)).resolves.not.toThrow();
});
