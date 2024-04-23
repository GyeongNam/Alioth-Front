// notificationStore.js
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
      notifications: useStorage('my-notifications', []),
      hasNewNotifications: useStorage('has-new-notifications', false)
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
        this.hasNewNotifications = false;
      },
      removeNotification(index) {
        this.notifications.splice(index, 1);
        if (this.notifications.length === 0) {
          this.hasNewNotifications = false;
        }
      }
    }
  });
  