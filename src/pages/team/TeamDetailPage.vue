<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>






      <v-card flat>
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
<!--

          <tbody>
          <tr v-for="item in employees" :key="item.name">
            <td><router-link :to="{ path: '/SalesMembersList/Detail', query: { name: item.name } }">{{ item.name }}</router-link></td>
            <td>{{ item.position }}</td>
            <td>{{ item.department }}</td>
            <td>{{ item.hireDate }}</td>
          </tr>
          </tbody>

-->
    </v-container>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue";
import router from "@/router";
import axios from "axios";
import { ref, onMounted } from 'vue'; // Composition API의 ref와 onMounted 임포트
export default {
  components: {ListComponent, AppHeader, AppSidebar},
  props: ['teamId'],
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
      axios.get(`${baseUrl}/api/team/detail/${props.teamId}`)
        .then(response => {
          const data = response.data.result.list();
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
      navigateToDetail
    }
  },

}
</script>

<style scoped>

</style>
