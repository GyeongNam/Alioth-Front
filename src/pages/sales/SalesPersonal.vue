<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <div>
        <h1>개인매출조회</h1>
      </div>
      <SalesPersonalTableChart></SalesPersonalTableChart>


    </v-container>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import SalesPersonalTableChart from "@/pages/sales/charts/SalesPersonalTableChart"



export default {
  components: {AppHeader, AppSidebar, SalesPersonalTableChart},
  setup() {


    return {}
  }
}
</script>

<style scoped>

</style>
