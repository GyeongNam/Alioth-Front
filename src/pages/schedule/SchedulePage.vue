<template>
  <div>
    <AppSidebar></AppSidebar>
    <v-main>
      <AppHeader></AppHeader>
      <v-container fluid>
        <v-row no-gutters>
          <v-col>
            <v-sheet class="pa-2 ma-2">
            <div style="width: 60vh; height: auto" id="calendarList"></div>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="pa-2 ma-2">
            <FullCalendar style="width: 100vh" :options="calendarOptions"></FullCalendar>
            </v-sheet>
          </v-col >
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";

import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';

let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'All-day event',
    start: todayStr
  },
  {
    id: 2,
    title: 'Timed event',
    start: todayStr + 'T12:00:00'
  }
]

export default {
  components: { AppHeader, AppSidebar, FullCalendar },
  setup() {
  },
  mounted() {
    const calendarEl = document.getElementById('calendarList');
    this.calendar = new Calendar(calendarEl, {
      plugins: [ listPlugin ],
      locale: "ko",
      initialView: 'listDay',
      initialEvents: INITIAL_EVENTS,
      buttonText: {
        today: '오늘',
        listDay: '일',
        listWeek: '주',
        listMonth: '월',
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'listDay,listWeek,listMonth'
      },
    });
    this.calendar.render();
  },
  data() {
    return {
      calendarOptions: {
        locale: "ko",
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
          today: '오늘',
          day: '일',
          week: '주',
          month: '월',
        },
        initialEvents: INITIAL_EVENTS,
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        eventDrop: this.handleEventDrop
      },
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      console.log(selectInfo);
    },
    handleEventClick(clickInfo) {
      console.table(clickInfo)
    },
    handleEventDrop(dropInfo){
      console.table(dropInfo)
    },
    handleEvents(events) {
      this.currentEvents = events
    },
  }
}
</script>

<style scoped>
/* 스타일링 */
</style>
