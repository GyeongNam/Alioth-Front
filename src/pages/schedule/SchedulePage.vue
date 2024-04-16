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
import axiosInstance from "@/plugins/loginaxios";
import { ref, onMounted, watch  } from 'vue';

const baseUrl = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

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

    axiosInstance.get(baseUrl+'/api/schedule/list')
      .then(response => {
        this.eventList.value = response.data.result;
        this.calendarEventCreate(this.eventList.value)
      })
      .catch(error => {
        console.error(error);
      });

  },
  data() {
    return {
      eventList: ref([]),
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
    calendarEventCreate(eventList){
      eventList.forEach(event => {
        const newEvent = {
          id: event.scheduleId,
          title: event.scheduleTitle,
          content: event.scheduleNote,
          start: event.scheduleStartTime,
          end: event.scheduleEndTime,
          allDay: (event.allDay === "1" ? true : false),
          backgroundColor: '#dd00ff', // 배경색
          borderColor: '#00ff48', // 테두리색
          textColor: '#ffffff' // 텍스트색
        };

        const firstCalendar = this.$refs.firstCalendar.calendar;
        firstCalendar.addEvent(newEvent);

        const secondCalendar = this.$refs.secondCalendar.calendar;
        secondCalendar.addEvent(newEvent);
      });
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
