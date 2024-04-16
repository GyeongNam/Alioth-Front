<template>
  <div>
    <AppSidebar></AppSidebar>
    <v-main>
      <AppHeader></AppHeader>
      <v-container fluid>
        <v-row no-gutters>
          <v-col>
            <v-sheet class="pa-2 ma-2">
              <div ref="firstCalendar" style="width: 50vh; height: auto; font-size: 80%" id="calendarList"></div>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="pa-2 ma-2">
              <FullCalendar ref="secondCalendar" style="width: 100vh; font-size: 80%" :options="calendarOptions"></FullCalendar>
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

export default {
  components: { AppHeader, AppSidebar, FullCalendar },
  mounted() {
    const calendarListEl = document.getElementById('calendarList');
    const firstCalendar = new Calendar(calendarListEl, {
      plugins: [listPlugin],
      locale: "ko",
      initialView: 'listDay',
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
      }
    });
    firstCalendar.render();
    this.$refs.firstCalendar.calendar = firstCalendar;
  },
  data() {
    return {
      eventList: [],
      calendarOptions: {
        locale: "ko",
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
          today: '오늘',
          dayGridMonth: '월',
          timeGridWeek: '주',
          timeGridDay: '일',
        },
        initialView: 'dayGridMonth',
        initialEvents: '',
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        eventDrop: this.handleEventDrop
      }
    }
  },
  methods: {
    calendarEventCreate(selectInfo){
      const newEvent = {
        id: this.eventList.length + 1,
        title: 'New Event',
        start: selectInfo.start,
        end: new Date(selectInfo.start.getTime() + (8 * 60 * 60 * 1000)),
        allDay: false
      };

      const firstCalendar = this.$refs.firstCalendar.calendar;
      firstCalendar.addEvent(newEvent);

      const secondCalendar = this.$refs.secondCalendar.calendar;
      secondCalendar.addEvent(newEvent);
    },

    handleDateSelect(selectInfo) {
      

      if(selectInfo == null){
        this.calendarEventCreate(selectInfo)
      }

    },
    handleEventClick(clickInfo) {
      console.table(clickInfo)
    },
    handleEventDrop(dropInfo){
      console.table(dropInfo)
      const updatedEvent = this.eventList.find(event => event.id === dropInfo.event.id);

      if (updatedEvent) {
        const firstCalendar = this.$refs.firstCalendar.calendar;
        firstCalendar.getEventById(updatedEvent.id).setDates(dropInfo.event.start, dropInfo.event.end);
      }

    },
    handleEvents(events) {
      this.eventList = events
    },
  }
}
</script>

<style scoped>
/* 스타일링 */
</style>
