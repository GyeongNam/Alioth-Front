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
import { ref } from 'vue';

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
  setup() {
    const currentEvents = ref(INITIAL_EVENTS);

    return {
      currentEvents, // setup 함수에서 반환되는 객체에 포함합니다.
    };
  },
  mounted() {


    const calendarEl = document.getElementById('calendarList');
    this.calendar = new Calendar(calendarEl, {
      plugins: [ listPlugin ],
      locale: "ko",
      initialView: 'listDay',
      initialEvents: this.currentEvents,
      views: {
        listDay: { buttonText: '일'},
        listWeek: { buttonText: '주' },
        listMonth: { buttonText: '월' }
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
        initialEvents: this.currentEvents,
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
      },
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      let title = prompt('추가한다?')
      this.calendarApi = selectInfo.view.calendar

      this.calendarApi.unselect() // clear date selection

      if (title) {
        this.calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },
    handleEventClick(clickInfo) {
      console.table(clickInfo)
      if (confirm(`삭제할거임? '${clickInfo.event.title}'`)) {
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
