<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <div>
        <v-divider></v-divider>
        <h2>공지사항 상세조회</h2>
        <v-divider></v-divider>
        <v-list-item v-if="role!= HQ" prepend-icon="mdi-calendar-check" title="공지사항 수정" value="starred" @click="this.$router.push(`/BoardList/Modify`);"></v-list-item>


      </div>
    </v-container>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";

export default {
  components: {AppHeader, AppSidebar},
  setup() {


    return {}
  }
}
</script>

<style scoped>

</style>
