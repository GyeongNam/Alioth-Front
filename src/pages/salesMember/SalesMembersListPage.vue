<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
          사원 목록
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                        variant="solo-filled" flat hide-details single-line style="margin-right: 16px"></v-text-field>
          <v-select
            clearable
            label="팀 명"
            v-model="selectedTeam"
            :items="selectedTeamCode"
            item-title="name"
            item-value="value"
            variant="filled"
          ></v-select>

          <v-row>
            <v-col class="text-right">
              <v-btn variant="outlined" @click="navigateToAdd">사원 추가</v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-spacer></v-spacer>
        <ListComponent :columns="tableColumns" :rows="tableRows" @click:row="navigateToDetail"/>
      </v-card>
      <v-btn variant="outlined"  @click="downloadExcel">엑셀다운로드</v-btn>
    </v-container>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue";
import router from "@/router";
import {ref, onMounted, watch} from 'vue';
import axiosInstance from "@/plugins/loginaxios"; // Composition API의 ref와 onMounted 임포트


export default {
  components: {ListComponent, AppHeader, AppSidebar},

  setup() {
    const salesMemberCode = ref('salesMemberCode');

    const tableColumns = [
      {title: "No", key: "id"},
      {title: "이름", key: "name"},
      {title: "사원코드", key: "salesMemberCode"},
      {title: "직급", key: "rank"},
      {title: "팀", key: "teamName"},
      {title: "팀 코드", key: "teamCode"},
      {title: "모바일", key: "phone"},
      {title: "사무실", key: "officeAddress"},
      {title: "내선 번호", key: "extensionNumber"},
    ];
    const tableRows = ref([]);
    const selectedTeamCode = ref([])
    const selectedTeam = ref(null);
    const filteredTeamCodes = ref([]);

    const baseUrl = import.meta.env.VITE_API_SERVER_BASE_URL || 'http://localhost:8080'; // process.env를 사용하여 환경 변수에 접근

    const fetchData = () => {
      axiosInstance.get(`${baseUrl}/api/members/list`)
        .then(response => {
          let data = response.data.result;
          selectedTeamCode.value = [{name: "ALL", value: null}];

          // tableRows에 데이터를 할당합니다.
          console.log(data)
          // 테이블 데이터에서 teamCode만 추출하여 중복을 제거하고 팀 코드 목록을 얻습니다.
          const teamCodes = Array.from(new Set(data.map(item => item.teamCode)))
            .map(code => ({
              name: data.find(item => item.teamCode === code).teamName,
              value: code,
            }));
          console.log(teamCodes)
          selectedTeamCode.value = [
            ...selectedTeamCode.value,
            ...teamCodes
          ];
          if (selectedTeam.value !== null) {
            data = data.filter(item=> item.teamCode === selectedTeam.value);
          }

          tableRows.value = data.map((item, index) => ({
            ...item,
            id: index + 1
          }));
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
    };


    function navigateToDetail(event, {item}) {
      router.push({path: `/SalesMembersList/Detail/${item.salesMemberCode}`});
    }

    function navigateToAdd() {
      router.push(`/SalesMembersList/Add`);
    }

    watch(selectedTeam, () => {
      fetchData();
    });

    onMounted(() => {
      fetchData();
    });

    function downloadExcel() {
      const requestData = {
        startDate: null,
        endDate: null
      };
      let url = null
      console.log(selectedTeam.value)
      if(selectedTeam.value !== null){
        url = `${baseUrl}/api/excel/export/salesMembers/${selectedTeam.value}`
      } else {
        url = `${baseUrl}/api/excel/export/salesMembers`
      }

      axiosInstance.post(url,requestData, {
        responseType: 'blob'
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '사원목록.xlsx');
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
        })
    }
    return {
      navigateToDetail,
      navigateToAdd,
      downloadExcel,
      tableColumns,
      tableRows,
      salesMemberCode,
      selectedTeamCode,
      selectedTeam,
      filteredTeamCodes,
    }
  },
}
</script>

<style scoped>

</style>
