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

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}

export default {
  components: { AppHeader, AppSidebar, FullCalendar },
  mounted() {
    const calendarEl = document.getElementById('calendarList');
    const calendar = new Calendar(calendarEl, {
      plugins: [ listPlugin ],
      locale: "ko",
      initialView: 'listDay',
      views: {
        listDay: { buttonText: 'list day' },
        listWeek: { buttonText: 'list week' },
        listMonth: { buttonText: 'list month' }
      },

      headerToolbar: {
        left: 'title',
        center: '',
        right: 'listDay,listWeek,listMonth'
      },
      events: []
    });
    calendar.render();
  },
  setup() {
  },
  data() {
    return {
      isLargeScreen: true,
      currentEvents: [],
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
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents
      },
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      let title = prompt('Please enter a new title for your event')
      let calendarApi = selectInfo.view.calendar

      calendarApi.unselect() // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },
    handleEventClick(clickInfo) {
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
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
