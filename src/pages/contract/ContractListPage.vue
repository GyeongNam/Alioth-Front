<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-divider></v-divider>
    <v-card flat>
      
      <v-spacer></v-spacer>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" class="my-2">

        <v-col cols="auto">
          <v-select v-model="selectedStatus" :items="statusOptions" label="Filter by Status" dense class="status-select"></v-select>
          <v-select v-model="selectedSalesMember" :items="salesMemberOptions" item-text="text" item-value="value" label="Filter by Sales Member" dense class="sales-member-select"></v-select>


        </v-col>
        <v-col cols="auto">
          <v-btn color="blue" @click="fetchData">해당 조건으로 검색</v-btn>
        </v-col>
      </v-row>
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
import router from "@/router";
import axiosInstance from '@/plugins/loginaxios';


export default {
  components: {AppSidebar, AppHeader, ListComponent},
  setup() {
    
    const tableColumns = ref([
      {title: "No", key: "id"},
      {title: "보험상품", key: "insuranceProductName"},
      {title: "고객", key: "customName"},
      {title: "계약사원", key: "salesMemberName"},
      {title: "계약 기간(년)", key: "contractPeriod"},
      {title: '계약일자', key: 'contractDate'},
      {title: '계약상태', key: 'contractStatus'}
    ]);
    const tableRows = ref([]);
    const search = ref('');
    const selectedStatus = ref();
    const statusOptions = ref(['New', 'Renewal', 'Cancellation']);
    const selectedCMmember = ref();
    const salesMemberOptions = ref([]);


    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      const params = {
        status: selectedStatus.value,
        salesMember: selectedCMmember.value
      };

      axiosInstance.get(`${baseUrl}/api/contract/list`, {params})
      .then(response => {
        const data = response.data.result;
        console.log("Loaded data:", data);
        data.forEach((item, index) => {
          item.id = index + 1;
        });
        tableRows.value = data;
      }).catch(error => {
        console.error('Error fetching data:', error);
      });

      // fetchSalesMembers();
      console.log("dsdsdsds")
      console.log(salesMemberOptions)
      console.log(statusOptions)
    };

    const fetchSalesMembers = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      axiosInstance.get(`${baseUrl}/api/members/list`) // API 경로가 맞는지 확인 필요
      .then(response => {
        console.log("response:",response)
        salesMemberOptions.value = response.data.result.map(member => {
          return { text: member.name, value: member.salesMemberCode };
        });
      })
      .catch(error => {
        console.error('Error fetching sales members:', error);
      });
    };


    const navigateToAddModify = () => {
      router.push('/ContractList/AddModify');
    };

    const navigateToDetail = (item) => {
      router.push(`/ContractList/Detail/${item.item.id}`);
    };

    onMounted(() => {
      fetchData();
      fetchSalesMembers();
    });

    

    return {
      tableColumns,
      tableRows,
      search,
      selectedStatus,
      statusOptions,

      fetchData,
      fetchSalesMembers,
      navigateToAddModify,
      navigateToDetail,
      
    };
  }
};
</script>


<style scoped>
.status-select {
  width: 250px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.my-2 {
  margin-top: 16px; 
  margin-bottom: 16px;
}
.sales-member-select {
  width: 250px;
  margin-top: 8px;
  margin-bottom: 8px;
}

</style>
