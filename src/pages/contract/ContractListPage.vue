<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-divider></v-divider>
    <v-card flat>
      <v-spacer></v-spacer>

      <v-row align="center">
        <v-col cols="4">
          <v-text-field 
            v-model="search" 
            label="Search" 
            prepend-inner-icon="mdi-magnify" 
            variant="outlined" 
            dense>
          </v-text-field>
        </v-col>
        <v-col class="d-flex justify-end">
        <v-col cols="4" >
          <v-select 
            v-model="selectedStatus" 
            :items="statusOptions" 
            label="Status" 
            outlined 
            dense>
          </v-select>
        </v-col>

        <v-col cols="4">
          <v-select 
            v-model="selectedCMmember" 
            :items="salesMemberOptions" 
            label="Sales Member" 
            outlined 
            dense>
          </v-select>
        </v-col>

        <v-col cols="1">
          <v-btn 
            color="grey" 
            text 
            @click="navigateToAddModify">
            계약추가
          </v-btn>
        </v-col>
        </v-col>

        <v-col cols="1">
          <v-btn 
            color="grey" 
            text 
            @click="downloadExcel">
            엑셀다운로드
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <ListComponent :columns="tableColumns" :rows="tableRows" @row-click="navigateToDetail" />
    </v-card>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import ListComponent from "@/layouts/ListComponent.vue";
import { ref, onMounted, watch } from 'vue';
import router from "@/router";
import axiosInstance from '@/plugins/loginaxios';

export default {
  components: { AppSidebar, AppHeader, ListComponent },
  setup() {
    const tableColumns = ref([
      { title: "No", key: "id" },
      { title: "보험상품", key: "insuranceProductName" },
      { title: "고객", key: "customName" },
      { title: "계약사원", key: "salesMemberName" },
      { title: "계약 기간(년)", key: "contractPeriod" },
      { title: '계약일자', key: 'contractDate' },
      { title: '계약만료일자', key: 'contractExpireDate'},
      { title: '계약상태', key: 'contractStatus' }
    ]);
    const tableRows = ref([]);
    const search = ref('');
    const selectedStatus = ref(null);
    const statusOptions = ref(['New', 'Renewal', 'Cancellation']);
    const selectedCMmember = ref(null);
    const salesMemberOptions = ref([]);

    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      axiosInstance.get(`${baseUrl}/api/contract/list`)
        .then(response => {
          let data = response.data.result;
      console.log("Initial loaded data:", data);

      if (selectedStatus.value) {
        data = data.filter(contract => contract.contractStatus === selectedStatus.value);
      }
      if (selectedCMmember.value) {
        data = data.filter(contract => contract.salesMemberName === selectedCMmember.value);
      }

      tableRows.value = data.map((item, index) => ({ ...item, id: index + 1 }));
      console.log("Filtered data:", tableRows.value);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

      fetchSalesMembers();
    };

    
    const downloadExcel = () => {
    const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
    const requestData = {
      startDate: null,
      endDate: null
    };
    axiosInstance.post(`${baseUrl}/api/excel/export/contract`, requestData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ContractList.xlsx');
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error downloading the file:', error.response);
    });
  };

    const fetchSalesMembers = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      axiosInstance.get(`${baseUrl}/api/members/list`)
        .then(response => {
          salesMemberOptions.value = response.data.result.map(member => member.name);
        //   if (salesMemberOptions.value.length > 0 && !selectedCMmember.value) {
        //     selectedCMmember.value = salesMemberOptions.value[0]; // 첫 번째 멤버 이름을 기본 선택으로 설정
        //   }
        }).catch(error => {
          console.error('Error fetching sales members:', error);
        });
    };

    const navigateToAddModify = () => {
      router.push('/ContractList/AddModify');
    };

    const navigateToDetail = (item) => {
      router.push(`/ContractList/Detail/${item.item.id}`);
    };


    watch([selectedStatus, selectedCMmember], fetchData);


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
      selectedCMmember,
      salesMemberOptions,
      fetchData,
      fetchSalesMembers,
      navigateToAddModify,
      navigateToDetail,
      downloadExcel
    };
  }
};
</script>


<style scoped>
.v-text-field, .v-select, .v-btn {
  height: 50px;
}
.d-flex.justify-end {
  display: flex;
  justify-content: flex-end;
}
</style>
