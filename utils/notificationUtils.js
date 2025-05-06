import * as Notifications from 'expo-notifications';

export async function cancelTaskNotification(task) {
  if (task?.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(task.notificationId);
  }
}