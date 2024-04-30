<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <div>
        <h1>메인</h1>
      </div>

      <VCol cols="12" md="10">
        <AnalyticsTransactions />
      </VCol>


    </v-container>
  </v-main>
</template>

<script>
import AppHeader from "@/layouts/AppHeader.vue";
import AppSidebar from "@/layouts/AppSidebar.vue";
import AnalyticsTransactions from "@/pages/main/charts/AnalyticsTransactions.vue"


export default {
  components: {
    AppSidebar, AppHeader, AnalyticsTransactions
  },
  setup() {


    return {}
  }
}
</script>

<style scoped>

</style>

