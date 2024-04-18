// notificationStore.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
      notifications: [],
      hasNewNotifications: false
    }),
    getters: {
      getNotificationIndexById: (state) => (messageId) => {
        return state.notifications.findIndex(
          (notification) => notification.messageId === messageId
        );
      }
    },
    actions: {
      addNotification(notification) {
        const index = this.getNotificationIndexById(notification.messageId);
        if (index === -1) {
          this.notifications.push(notification);
          this.hasNewNotifications = true;
        }
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
  