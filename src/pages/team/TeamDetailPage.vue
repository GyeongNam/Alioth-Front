<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <v-card flat>
        <v-row>
          <v-col cols="4" offset="3"> <!-- 팀 명 -->
            <v-card text="팀명" variant="outlined" > {{ teamName }} </v-card>
          </v-col>
          <v-col cols="4" offset="1" > <!-- 팀장 -->
            <v-card text="팀장" variant="outlined"> {{ teamLeader }} </v-card>
          </v-col>
        </v-row>
      </v-card>

      <div style="margin-bottom: 16px;"></div>

      <v-card>
        <v-card-title class="d-flex align-center pe-2">
          <!--          <v-icon icon="fa:fas fa-edit"></v-icon> &nbsp;-->
          팀원 목록
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line></v-text-field>
          <v-row>
            <v-col class="text-right">
              <v-btn variant="outlined" @click="navigateToAdd">팀원 추가</v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-spacer></v-spacer>
        <ListComponent :columns="tableColumns" :rows="tableRows"  @click:row="navigateToDetail" />
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue";
import router from "@/router";
import { ref, onMounted } from 'vue';
import axiosInstance from "@/plugins/loginaxios"; // Composition API의 ref와 onMounted 임포트
export default {
  components: {ListComponent, AppHeader, AppSidebar},
  props : {
    teamCode: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const tableColumns = [
      {title: "프로필사진", key: "profileImage"},
      {title: "이름", key: "name"},
      {title: "사원코드", key: "salesMemberCode"},
      {title: "직급", key: "rank"},
      {title: "이메일", key: "email"},
      {title: "모바일", key: "phone"},
      {title: "사무실", key: "officeAddress"},
      {title: "내선 번호", key: "extensionNumber"},
    ];
    const tableRows = ref([]); // ref를 사용하여 반응형 데이터 생성

    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080'; // process.env를 사용하여 환경 변수에 접근
      axiosInstance.get(`${baseUrl}/api/team/detail/${props.teamCode}`)
        .then(response => {
          const data = response.data.result;
          const { teamName, teamLeader, list } = data;
          // 데이터를 Vue 데이터에 할당
          teamName.value = teamName;
          teamLeader.value = teamLeader;
          // 데이터를 가져온 후에 각 항목에 대한 ID를 추가
          list.forEach((item, index) => {
            item.id = index + 1;
          });
          tableRows.value = list;
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
    };
    const teamName = ref('');
    const teamLeader = ref('');
    function navigateToDetail(item) {
      router.push({ path: `/SalesMembersList/Detail`, query: { id: item.id }});
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
      teamName,
      teamLeader
    }
  },

}
</script>

<style scoped>

</style>
