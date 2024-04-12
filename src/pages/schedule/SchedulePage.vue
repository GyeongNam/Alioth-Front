<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <div>
        <h1>일정</h1>
      </div>
      <div id="calendar" style="height: 40vw;"></div>
      <div id="clicked-event"></div>
    </v-container>
  </v-main>
</template>

<script>
import { ref, onMounted } from 'vue';
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

export default {
  components: {AppHeader, AppSidebar},
  setup() {
    const calendarInstance = ref(null);

    onMounted(() => {
      const container = document.getElementById('calendar');
      const options = {
        defaultView: 'month',
        timezone: {
          zones: [
            {
              timezoneName: 'Asia/Seoul',
              displayLabel: 'Seoul',
            },
          ],
        },
      };
      calendarInstance.value = new Calendar(container, options);
      calendarInstance.value.createEvents([
        {
          id: 'event1',
          calendarId: 'cal2',
          title: '주간 회의',
          start: '2024-04-12T09:00:00',
          end: '2024-04-13T10:00:00',
        },
        {
          id: 'event2',
          calendarId: 'cal1',
          title: '점심 약속',
          start: '2024-04-12T12:00:00',
          end: '2024-04-13T13:00:00',
        },
        {
          id: 'event3',
          calendarId: 'cal2',
          title: '휴가',
          start: '2024-04-12',
          end: '2024-04-13',
          isAllday: true,
          category: 'allday',
        },
      ]);
    });

    return {
      calendarInstance
    };
  }
}
</script>

<style scoped>

</style>
