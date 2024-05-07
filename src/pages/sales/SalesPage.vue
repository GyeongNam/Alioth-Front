<template>
  <AppSidebar></AppSidebar>
  <v-container fluid>
    <v-main>
      <AppHeader></AppHeader>
        <v-col class="text-right">
          <v-btn variant="tonal" color="#1A237E" onclick="location.href=`/Sales/Ranking`" style="margin-right: 1vw">매출순위</v-btn>
        </v-col>

      <v-row class="mt-4">
        <v-col cols="12" md="5">
          <v-card class="p-20">
            <SalesPageTargetChart style="width: 80%;"></SalesPageTargetChart>
          </v-card>
        </v-col>


        <v-col cols="12" md="5">
          <v-card>
            <SalesTransChart></SalesTransChart>
          </v-card>
        </v-col>
      </v-row>

      <!-- <v-row>
        <v-col cols="12" md="5">
          <v-card>
            <SalesPagePieChart :loaded_PricePie="loaded_PricePie"></SalesPagePieChart>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card>
            <SalesPageCountPieChart :loaded_CountPie="loaded_CountPie"></SalesPageCountPieChart>
          </v-card>
        </v-col>
      </v-row> -->

      <v-row>
        <v-col cols="12" md="10"> <!-- Changed md="5" to md="7" -->
          <SalesUserTable></SalesUserTable>
        </v-col>
      </v-row>


    </v-main>
  </v-container>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import SalesPagePieChart from "@/pages/sales/charts/SalesPagePieChart"
import SalesPageCountPieChart from "@/pages/sales/charts/SalesPageCountPieChart"
import SalesPageTargetChart from "@/pages/sales/charts/SalesPageTarget"
import SalesTransChart from "@/pages/sales/charts/SalesAnalytics.vue"
import SalesUserTable from "@/pages/sales/charts/AnalyticsUserTable.vue"
import ListComponent from "@/layouts/ListComponent.vue";

export default {
  components: {
    AppHeader, AppSidebar, SalesPagePieChart, SalesPageCountPieChart, SalesPageTargetChart,
    SalesTransChart, SalesUserTable, ListComponent
  },
  setup() {
    const loaded_CountPie = ref(false);
    const loaded_PricePie = ref(false);

    // 데이터 로딩 후 loaded 상태 변경
    setTimeout(() => {
      loaded_CountPie.value = true;
    }, 1000); // 예시로 setTimeout 사용, 실제 데이터 로딩 후 변경하는 로직으로 변경

    setTimeout(() => {
      loaded_PricePie.value = true;
    }, 2000);


    return {
      loaded_CountPie,
      loaded_PricePie
    }
  },
  data() {
    return {
      selectedPeriod: '월', // 초기 선택값은 월로 설정
    };
  },
  methods: {},
}
</script>

<style scoped>
.grey {
  background-color: grey !important; /* 회색 배경색 */
  color: white !important; /* 흰색 텍스트색 */
}
</style>
