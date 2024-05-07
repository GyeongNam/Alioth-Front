<template>
  <AppSidebar></AppSidebar>
  <v-container fluid>
    <v-main>
      <AppHeader></AppHeader>
      <v-card style="margin-top: 10px;">
        <v-row align="center">
          <v-col cols="4" class="pa-2 ma-2">
            <v-text-field style="margin-bottom: 15px; margin-left: 15px; margin-top: 15px;" v-model="search"
                          label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" dense>
            </v-text-field>
          </v-col>
          <v-col class="text-right">
            <v-btn variant="tonal" color="#2979FF" @click="navigateToAdd" style="margin-right:1vw">팀 추가</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <ListComponent :columns="tableColumns" :rows="tableRows" @click:row="navigateToDetail"/>
      </v-card>
    </v-main>
  </v-container>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue";
import router from "@/router";
import {ref, onMounted} from "vue";
import axiosInstance from "@/plugins/loginaxios";

export default {
  components: {ListComponent, AppHeader, AppSidebar,},
  setup() {
    const tableColumns = [
      {title: "No", key: "id"},
      {title: "팀 명", key: "teamName"},
      {title: "팀 코드", key: "teamCode"},
      {title: "팀장", key: "teamManagerName"},
    ];
    const tableRows = ref([]); // ref를 사용하여 반응형 데이터 생성
    const teamCode = ref('teamCode');
    const fetchData = () => {
      const baseUrl = import.meta.env.VITE_API_SERVER_BASE_URL || 'http://localhost:8080'; // process.env를 사용하여 환경 변수에 접근
      axiosInstance.get(`${baseUrl}/api/team/list`)
        .then(response => {
          const data = response.data.result;
          console.log('팀 목록 데이터:', data);
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

    function navigateToDetail(event, {item}) {
      router.push({path: `/Team/Detail/${item.teamCode}`});
    }

    function navigateToAdd() {
      router.push(`/Team/Add`);
    }

    onMounted(() => {
      fetchData();
    });

    return {
      tableColumns,
      tableRows,
      navigateToAdd,
      navigateToDetail,
      teamCode
    }
  },

}
</script>

<style scoped>

</style>
