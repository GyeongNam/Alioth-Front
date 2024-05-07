<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <div>
        <v-divider></v-divider>
        <h2>매출 메인 화면</h2>
        <v-divider></v-divider>
        <v-col align="center" class="text-center">
          <v-btn variant="tonal" color="#1A237E" onclick="location.href=`/Sales/Ranking`" style="margin-right: 1vw">매출순위</v-btn>
        </v-col>
      </div>
      <v-row align="center">
        <v-col cols="2">
          <v-btn class="mt-1" @click="showDatePickerDialog">
              <v-icon left>mdi-calendar</v-icon>
              날짜 선택
          </v-btn>
        </v-col>

        <v-col cols="12">
            <!-- <v-text-field v-model="startDate" class="mt-3" readonly></v-text-field> -->
            <v-dialog v-model="datePickerDialog" persistent max-width="300px">
              <v-card>
                <v-card-title>날짜 선택</v-card-title>

                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="startDate" label="선택 날짜" type="month"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="applyDate">적용</v-btn>
                  <v-btn color="secondary" @click="cancelDateRange">취소</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </v-col>
      </v-row>

      <v-row>
        <v-card-title> {{ startDate }}</v-card-title>
      </v-row>




      <v-row class="mt-4">


        <v-col cols="12" md="5">
          <v-card class="p-20">
            <SalesPageTargetChart></SalesPageTargetChart>
          </v-card>
        </v-col>


        <v-col cols="12" md="5">
          <VCard title="판매 실적">
            <VCardText class="pt-10">
              <VRow>
                <VCol cols="12" sm="6" md="6" class="mb-5">
                  <VCard color="primary" class="text-center">
                    <div class="d-flex align-center justify-center gap-x-3 py-4">
                      <div class="d-flex flex-column">
                        <div class="text-body-1">
                          {{ statistics[0].title }}
                        </div>
                        <h5 class="text-h5">
                          {{ statistics[0].stats }}
                        </h5>
                      </div>
                    </div>
                  </VCard>
                </VCol>
                <VCol cols="12" sm="6" md="6" class="mb-5">
                  <VCard color="success" class="text-center">
                    <div class="d-flex align-center justify-center gap-x-3 py-4">
                      <div class="d-flex flex-column">
                        <div class="text-body-1">
                          {{ statistics[1].title }}
                        </div>
                        <h5 class="text-h5">
                          {{ statistics[1].stats }}
                        </h5>
                      </div>
                    </div>
                  </VCard>
                </VCol>
                <VCol cols="12" sm="6" md="6" class="mb-8">
                  <VCard color="warning" class="text-center">
                    <div class="d-flex align-center justify-center gap-x-3 py-4">
                      <div class="d-flex flex-column">
                        <div class="text-body-1">
                          {{ statistics[2].title }}
                        </div>
                        <h5 class="text-h5">
                          {{ statistics[2].stats }}
                        </h5>
                      </div>
                    </div>
                  </VCard>
                </VCol>
                <VCol cols="12" sm="6" md="6">
                  <VCard color="info" class="text-center">
                    <div class="d-flex align-center justify-center gap-x-3 py-4">
                      <div class="d-flex flex-column">
                        <div class="text-body-1">
                          {{ statistics[3].title }}
                        </div>
                        <h5 class="text-h5">
                          {{ statistics[3].stats }}
                        </h5>
                      </div>
                    </div>
                  </VCard>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </v-col>
      </v-row>


              <!-- ListComponent에 데이터를 표시하는 부분 -->
      <ListComponent
        v-if="model === '개인'"
        :columns="headers"
        :rows="formattedItems"
      />


    </v-container>
  </v-main>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import SalesPagePieChart from "@/pages/sales/charts/SalesPagePieChart"
import SalesPageCountPieChart from "@/pages/sales/charts/SalesPageCountPieChart"
import SalesPageTargetChart from "@/pages/sales/charts/SalesPageTarget"
import SalesTransChart from "@/pages/sales/charts/SalesAnalytics.vue"
import { useSalesStore } from '@/stores/SalesStore';
import { useLoginInfoStore } from '@/stores/loginInfo';
import ListComponent from "@/layouts/ListComponent.vue";


export default {
  components: {
    AppHeader, AppSidebar, SalesPagePieChart, SalesPageCountPieChart, SalesPageTargetChart,
    SalesTransChart, ListComponent
  },
  setup() {
    const loaded_CountPie = ref(false);
    const loaded_PricePie = ref(false);
    const model = ref('개인'); // 리액티브 변수로 선언
    let datePickerDialog = ref(false);
    let startDate = ref("");
    const SalesStore = useSalesStore();

    // 데이터 로딩 후 loaded 상태 변경
    setTimeout(() => {
      loaded_CountPie.value = true;
    }, 1000); // 예시로 setTimeout 사용, 실제 데이터 로딩 후 변경하는 로직으로 변경

    setTimeout(() => {
      loaded_PricePie.value = true;
    }, 2000);

    const showDatePickerDialog = () => {
      datePickerDialog.value = true;
    };

    const cancelDateRange = () => {
      datePickerDialog.value = false; // 모달 닫기
    };

    return {
      loaded_CountPie, loaded_PricePie, model,
      datePickerDialog, startDate, SalesStore,
      showDatePickerDialog, cancelDateRange,
    }
  },
  data() {
    return {
      //selectedPeriod: '월', // 초기 선택값은 월로 설정
      loginStore: useLoginInfoStore(),
      items: [],
      headers: [
        { title: 'No', key: 'id' },
        // { title: '사원 이름', key: 'salesMemberName' },
        // { title: '사원 코드', key: 'salesMemberCode' },
        { title: '계약 총금액', key: 'contractPrice' },
        { title: '계약 건수', key: 'contractCount' },
        { title: '해약 총금액', key: 'cancelPrice' },
        { title: '해약 건수', key: 'cancelCount' },
      ],
      statistics: [
        {
          title: '매출',
          stats: '-',
          color: 'primary',
        },
        {
          title: '계약건수',
          stats: '-',
          color: 'success',
        },
        {
          title: '해약 매출',
          stats: '-',
          color: 'warning',
        },
        {
          title: '해약 건수',
          stats: '-',
          color: 'info',
        }
      ],
    };
  },
  computed: {
    formattedItems() {
      return this.items.map(item => ({ ...item }));
    },
  },
  methods: {
    applyDate() {
      console.log("매출메인 선택날짜:", this.startDate);
      this.memberList();
      this.memberShot();

      useSalesStore().startDate = this.startDate;

      this.datePickerDialog = !this.datePickerDialog; // 모달 닫기
    },

    async memberList() {
      const memberCode = this.loginStore.getMemberCode;
      const date = this.startDate;

      let url = `http://localhost:8081/api/stat/sales/${memberCode}/${date}`;
      console.log(url);

      await axios.get(url)
        .then(response => {
          console.log("SalesMemberListr 응답결과 : ", response);
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
    async memberShot() {
      const memberCode = this.loginStore.getMemberCode;
      const date = this.startDate;

      let url = `http://localhost:8081/api/stat/sales/${memberCode}/${date}/price`;
      console.log(url);

      await axios.get(url)
        .then(response => {
          console.log("사원 맴버 결과 응답결과 : ", response.data.result);
          const result = response.data.result || "-";
          //this.statistics[0].stats = result.contractPrice + "원" || "-";
          this.statistics[0].stats = Number(result.contractPrice).toLocaleString() + "원" || "-";
          this.statistics[1].stats = Number(result.contractCount) + "건" || "-";
          this.statistics[2].stats = Number(result.cancelPrice) + "원" || "-";
          this.statistics[3].stats = Number(result.cancelCount) + "건" || "-";
        })
        .catch(error => {
          console.log("요청할 수 없습니다. : ", error);
        });
    },
    async memberTarget() {

    },
  },
}
</script>

<style scoped>
  .grey {
    background-color: grey !important; /* 회색 배경색 */
    color: white !important; /* 흰색 텍스트색 */
  }
</style>
