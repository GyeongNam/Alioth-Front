<template>
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
            <FullCalendar ref="secondCalendar" style="width: 100vh; font-size: 80%"
                          :options="calendarOptions"></FullCalendar>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <v-dialog v-model="modalOpen" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">이벤트 등록</span>
      </v-card-title>
      <v-card-text>
        <!-- 모달 내용 -->
        <v-container>
          <v-row>
            <!-- 이벤트명 입력 -->
            <v-col cols="12">
              <v-text-field v-model="newEvent.title" label="이벤트명"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <VueDatePicker  locale="ko" v-model="newEvent.start" />
            </v-col>

            <v-col cols="12" sm="6">
              <VueDatePicker locale="ko" v-model="newEvent.end" />
            </v-col>
            <v-col cols="12">
              <v-checkbox v-model="newEvent.allDay" label="올데이"></v-checkbox>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-color-picker v-model="newEvent.color"> </v-color-picker>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="newEvent.content" label="일정 세부내용" rows="3"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveEvent">Save</v-btn>
        <v-btn color="grey" @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";

import {Calendar} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import axiosInstance from "@/plugins/loginaxios";
import {ref} from 'vue';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {th} from "vuetify/locale";

const baseUrl = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

export default {
  components: {AppHeader, AppSidebar, FullCalendar, VueDatePicker},
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

    this.getList();

  },
  data() {
    return {
      newStart: new Date,
      newEnd: new Date,
      startDatePicker: false,
      endDatePicker: false,
      modalOpen: false,
      newEvent: ref({}),
      eventList: ref({}),
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
    calendarEventRemove(){
      const firstCalendar = this.$refs.firstCalendar.calendar;
      firstCalendar.removeAllEvents();
      const secondCalendar = this.$refs.secondCalendar.calendar;
      secondCalendar.removeAllEvents();
    },
    calendarEventCreate(eventList) {
      eventList.forEach(event => {
        this.eventCreate(event)
      });
    },
    eventCreate(event){
      const newEvent = {
        id: event.scheduleId,
        title: event.scheduleTitle,
        content: event.scheduleNote,
        start: event.scheduleStartTime,
        end: event.scheduleEndTime,
        allDay: event.allDay === "true",
        backgroundColor: event.color, // 배경색
      };

      const firstCalendar = this.$refs.firstCalendar.calendar;
      firstCalendar.addEvent(newEvent);

      const secondCalendar = this.$refs.secondCalendar.calendar;
      secondCalendar.addEvent(newEvent);
    },


    handleDateSelect(selectInfo) {
      if (selectInfo) {
        this.newEvent.start = selectInfo.startStr;
        this.newEvent.end = selectInfo.endStr;
        this.modalOpen = true; // 모달 열기
      }
      if (selectInfo == null) {
        this.calendarEventCreate(selectInfo)
      }
    },
    handleEventClick(clickInfo) {
      console.table(clickInfo)
    },
    handleEventDrop(dropInfo) {
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
    saveEvent() {
      console.log(this.newEvent)

      const newSchedule = {
        "scheduleTitle": this.newEvent.title,
        "scheduleStartTime":this.dateTimeFormat(this.newEvent.start),
        "scheduleEndTime": this.dateTimeFormat(this.newEvent.end),
        "color": this.newEvent.color!== undefined ? this.newEvent.color : "#000000",
        "scheduleNote": this.newEvent.content,
        "scheduleType": "MEETING",
        "allDay":  this.newEvent.allDay === undefined ? "false" : "true"
      }

      console.log(newSchedule)
      axiosInstance.post(baseUrl + '/api/schedule/create',newSchedule)
        .then(response => {
          console.log(response)
          alert("일정이 추가 되었습니다.")
          this.calendarEventRemove()
          this.getList()
          this.modalOpen = false; // 모달 닫기
        })
        .catch(error => {
          console.error(error);
        });
    },
    closeModal() {
      this.modalOpen = false; // 모달 닫기
    },
    dateTimeFormat(dateTime){
      return new Date(dateTime).toISOString().slice(0, 19);
    },
    getList(){
      axiosInstance.get(baseUrl + '/api/schedule/list')
        .then(response => {
          this.eventList.value = response.data.result;
          this.calendarEventCreate(this.eventList.value)
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
}
</script>

<style scoped>
/* 스타일링 */
</style>
