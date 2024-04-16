<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
      <v-divider></v-divider>
      <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
<!--          <v-icon icon="fa:fas fa-edit"></v-icon> &nbsp;-->
          계약 목록
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line></v-text-field>
          <v-row>
            <v-col class="text-right">
              <v-btn variant="outlined" @click="navigateToAddModify">계약 추가</v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-spacer></v-spacer>
        <ListComponent :columns="tableColumns" :rows="tableRows"  @click:row="navigateToDetail" />
      </v-card>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue";
import { ref, onMounted } from 'vue'; // Composition API의 ref와 onMounted 임포트
import router from "@/router";
import axiosInstance from "@/plugins/loginaxios";

export default {
  components: {AppSidebar, AppHeader, ListComponent},
  setup() {
    const tableColumns = [
      {title: "No", key: "id"},
      {title: "보험상품", key: "insuranceProductName"},
      {title: "고객", key: "customName"},
      {title: "계약 일자", key: "contractPeriod"},
    ];
    const tableRows = ref([]); // ref를 사용하여 반응형 데이터 생성
    // 데이터 가져오는 함수
    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'; // process.env를 사용하여 환경 변수에 접근
      axiosInstance.get(`${baseUrl}/api/contract/list`)
        .then(response => {
          const data = response.data.result;
          // 데이터를 가져온 후에 각 항목에 대한 ID를 추가합니다.
          data.forEach((item, index) => {
            item.id = index + 1;
          });
          // tableRows에 데이터를 할당합니다.
          tableRows.value = data;
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
    };

    function navigateToAddModify() {
      router.push('/ContractList/AddModify');
    }
    function navigateToDetail(item) {
      router.push({ path: '/ContractList/Detail', query: { id: item.id }});
    }
    // 컴포넌트가 마운트되었을 때 데이터 가져오기
    onMounted(() => {
      fetchData();
    });

    // setup() 함수에서 반환해야 하는 객체
    return {
      tableColumns,
      tableRows,
      navigateToAddModify,
      navigateToDetail
    };
  },
};
</script>

<style scoped>

</style>
