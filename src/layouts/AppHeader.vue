<template>
<v-toolbar color="white" flat>
  <v-app-bar-title class="ms-auto">{{ pageName }}</v-app-bar-title>
  <template v-slot:append>
    <span class="ms-2">{{ currentDateTime }}</span>
    <v-menu offset-y open-on-hover>

      <template v-slot:activator="{ props, on }">
        <v-btn icon v-bind="props" v-on="{ ...on }">
          <v-icon :color="hasNewNotifications ? 'indigo darken-4' : 'grey darken-2'">mdi-bell</v-icon>
        </v-btn>
      </template>

      <v-card tile shaped class="pa-2" v-if="notifications && notifications.length > 0">
        <v-list dense>
          <v-list-item-group>
            <v-list-item
              v-for="(notification, index) in notifications"
              :key="index"
              @click="handleNotificationClick(index)"
              class="my-2"
            >
            <v-list-item-avatar>
              <v-icon>mdi-information</v-icon>
            </v-list-item-avatar>
            
            <v-list-item-content>
              <v-list-item-title class="headline">{{ notification.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ notification.body }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="index < notifications.length - 1"></v-divider>
        </v-list-item-group>
      </v-list>
    </v-card>
    </v-menu>
  </template>
</v-toolbar>
<v-divider :thickness="2" class="border-opacity-50"></v-divider>

</template>

<script>
import { computed, onBeforeUnmount, watch } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const notificationStore = useNotificationStore();
    const router = useRouter();
    const route = useRoute();

    const pageName = computed(() => route.meta.title || 'Not Found');

    watch(() => notificationStore.notifications, (newNotifications) => {
      console.log('알림이 업데이트되었습니다:', newNotifications);
    }, { deep: true, immediate: true });

    const handleNotificationClick = (index) => {
      console.log('알림 클릭 처리 중, 인덱스:', index);
      if (Array.isArray(notificationStore.notifications) && notificationStore.notifications.length > index) {
        const notification = notificationStore.notifications[index];
        console.log('선택된 알림:', notification);

        if (notification && notification.url) {
          notificationStore.removeNotification(index);
          console.log('Navigating to:', notification.url);
          router.push(notification.url);
          if (notificationStore.notifications.length === 0) {
            notificationStore.hasNewNotifications = false;
            console.log('모든 알림이 지워졌습니다.');
          }
        } else {
          console.error('url누락:', notification);
        }
      } else {
        console.error('Index out of bounds or notifications array is undefined or empty.');
      }
    };

    onBeforeUnmount(() => {
      console.log('Component is being destroyed, current notifications:', notificationStore.notifications);
    });

    return {
      hasNewNotifications: computed(() => notificationStore.hasNewNotifications),
      notifications: computed(() => notificationStore.notifications),
      handleNotificationClick,
      pageName
    };
  },
  data() {
    return {
      currentDateTime: '',
    };
  },
  mounted() {
    const updateDateTime = () => {
      const now = new Date();
      this.currentDateTime = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][now.getDay()]} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    };
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }
}
</script>

<style scoped>
.v-btn {
  position: relative;
  overflow: visible;
}

.v-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  border: 2px solid white;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.26);
}

.v-list-item {
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.v-menu__content {
  box-shadow: 0px 8px 16px rgba(0,0,0,0.15);
  border-radius: 8px;
}

</style>
