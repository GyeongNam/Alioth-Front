<template>
    <AppSidebar></AppSidebar>
    <v-container fluid>
    <v-main>
      <AppHeader></AppHeader>

        <v-row align="center">
          <v-col cols="12">
            <h2>개인 및 팀 매출</h2>
          </v-col>
          <v-col cols="12">
            <v-toolbar flat>
              <v-switch v-model="model"
                        :label="model === '개인' ? '개인' : '팀'"
                        :color="model === '개인' ? 'success' : 'info'"
                        :false-value="'개인'"
                        :true-value="'팀'"
                        hide-details
                        @change="fetchData">
              </v-switch>
            </v-toolbar>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <!-- ListComponent에 데이터를 표시하는 부분 -->
        <ListComponent
          v-if="model === '개인'"
          :columns="headers"
          :rows="formattedItems"
        />
        <ListComponent
          v-if="model === '팀'"
          :columns="teamHeaders"
          :rows="formattedTeamItems"
        />

      </v-main>
    </v-container>

</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue"; // ListComponent를 임포트하세요.
import axios from 'axios';

export default {
  components: { AppHeader, AppSidebar, ListComponent },
  setup() {
    const router = useRouter();
    const model = ref('개인'); // 리액티브 변수로 선언
    return { router, model };
  },
  data() {
    return {
      items: [],
      headers: [
        { title: 'No', key: 'id' },
        { title: '사원 이름', key: 'salesMemberName' },
        { title: '사원 코드', key: 'salesMemberCode' },
        { title: '계약 총금액', key: 'contractPrice' },
        { title: '계약 건수', key: 'contractCount' },
      ],
      teamItems: [],
      teamHeaders: [
        { title: 'No', key: 'id' },
        { title: '팀 이름', key: 'teamName' },
        { title: '팀 코드', key: 'teamCode' },
        { title: '계약 총금액', key: 'contractPrice' },
        { title: '계약 건수', key: 'contractCount' },
      ],
      memberCount: 0,
      teamCount: 0,
    }
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    formattedItems() {
      return this.items.map(item => ({ ...item }));
    },
    formattedTeamItems() {
      return this.teamItems.map(item => ({ ...item }));
    }
  },
  methods: {
    fetchData() {
      if (this.model === '개인') {
        this.getSalesMemberData();
      } else {
        this.getSalesTeamData();
      }
    },
    getSalesMemberData() {
      const baseUrl = import.meta.env.VITE_API_STATISTICS_BASE_URL
      axios.get(`${baseUrl}/api/batch/sales-member/day`)
        .then(response => {
          console.log("SalesRanking 응답결과 : ");
          this.items = response.data.result || [];
          this.items = this.items.map((items, index) => ({
            ...items,
            id: index + 1,
          }));
          console.log(this.items);
        })
        .catch(error => {
          console.log("요청할 수 없습니다. : ", error);
        });
    },
    getSalesTeamData() {
      const baseUrl = import.meta.env.VITE_API_STATISTICS_BASE_URL
      axios.get(`${baseUrl}/api/batch/sales-team/day`)
        .then(response => {
          console.log("SalesRanking 응답결과 : ");
          this.teamItems = response.data.result || [];

          this.teamItems = response.data.result || [];
          this.teamItems = this.teamItems.map((teamItems, index) => ({
            ...teamItems,
            id: index + 1,
          }));
          console.log(this.teamItems);
        })
        .catch(error => {
          console.log("요청할 수 없습니다. : ", error);
        });
    },
  },
}
</script>

<style scoped>

</style>
