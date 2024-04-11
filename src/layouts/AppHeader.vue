<template>
  <v-system-bar>

<!--    <v-icon icon="mdi-signal" class="ms-2"></v-icon>-->
<!--    <v-icon icon="mdi-battery" class="ms-2"></v-icon>-->
    <span class="ms-2">{{ currentDateTime }}</span>


    <v-icon icon="mdi-wifi-strength-4"></v-icon>
  </v-system-bar>
</template>

<script>
export default {
  data() {
    return {
      currentDateTime: ''
    };
  },
  mounted() {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 60000);
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const dayOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][now.getDay()];
      this.currentDateTime = `${year}년 ${month}월 ${day}일 ${dayOfWeek} ${hours}:${minutes}`;
    }
  },
  setup() {


    return {}
  }
}
</script>

<style scoped>

</style>
