<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-divider></v-divider>
    <v-card flat>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line></v-text-field>
        <v-row>
          <v-col class="text-right">
            <v-btn variant="outlined" @click="navigateToAddModify">계약 추가</v-btn>
          </v-col>
        </v-row>
      <v-spacer></v-spacer>
      <ListComponent :columns="tableColumns" :rows="tableRows" @row-click="navigateToDetail" />
    </v-card>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue";
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from "@/router";

export default {
  components: {AppSidebar, AppHeader, ListComponent},
  setup() {
    const tableColumns = ref([
      {title: "No", key: "id"},
      {title: "보험상품", key: "insuranceProductName"},
      {title: "고객", key: "customName"},
      {title: "계약 일자", key: "contractPeriod"},
      {title: '작성일자', key: 'contractDate'},
    ]);
    const tableRows = ref([]);

    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      const accessToken = localStorage.getItem('accessToken');

      axios.get(`${baseUrl}/api/contract/list`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(response => {
        const data = response.data.result;
        data.forEach((item, index) => {
          item.id = index + 1;
        });
        tableRows.value = data;
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    };

    const navigateToAddModify = () => {
      router.push('/ContractList/AddModify');
    };

    const navigateToDetail = (item) => {
      router.push(`/ContractList/Detail/${item.item.id}`);
    };

    onMounted(fetchData);

    return {
      tableColumns,
      tableRows,
      navigateToAddModify,
      navigateToDetail
    };
  }
};
</script>

<style scoped>
</style>
