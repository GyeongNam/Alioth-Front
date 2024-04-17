// notificationStore.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
      notifications: [],
      hasNewNotifications: false
    }),
    actions: {
      addNotification(notification) {
        this.notifications.push(notification);
        this.hasNewNotifications = true; // 새 알림이 추가될 때 true로 설정
      },
      clearNotifications() {
        this.notifications = [];
        this.hasNewNotifications = false; // 모든 알림을 지울 때 false로 설정
      },
      removeNotification(index) {
        this.notifications.splice(index, 1);
        if (this.notifications.length === 0) {
          this.hasNewNotifications = false; // 모든 알림이 삭제되었을 때만 false로 설정
        }
      }
    }
  });
  