<template>
  <v-app>
    <AppSidebar></AppSidebar>
    <v-main>
      <AppHeader></AppHeader>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-text>
                <v-form ref="form" @submit.prevent="submitForm">
                  <v-text-field v-model="form.contractDate" label="계약 시작 날짜" type="date" required></v-text-field>
                  <v-text-field v-model="form.contractExpireDate" label="계약 만료 날짜" type="date" required></v-text-field>
                  <v-text-field v-model="form.contractPeriod" label="계약 기간(년)" required></v-text-field>
                  <v-text-field v-model="form.contractTotalPrice" label="계약 총 금액(원)" required></v-text-field>
                  <v-text-field v-model="form.contractPaymentAmount" label="납입 금액(원)" required></v-text-field>
                  <v-select v-model="form.contractPaymentFrequency" :items="paymentFrequencies" label="납입 빈도" required></v-select>
                  <v-text-field v-model="form.contractPaymentMaturityInstallment" label="만기 회차" type="number" required></v-text-field>
                  <v-text-field v-model="form.contractCount" label="납입 회차" type="number" required></v-text-field>
                  <v-select v-model="form.contractPaymentMethod" :items="paymentMethods" label="납입 방식" required></v-select>
                  <v-text-field v-model="form.contractPayer" label="납입자" required></v-text-field>
                  <v-text-field v-model="form.insuranceProductId" label="보험상품ID" required></v-text-field>
                  <v-text-field v-model="form.contractMemberId" label="계약사원ID" required></v-text-field>
                  <v-text-field v-model="form.customId" label="고객ID" required></v-text-field>
                  <v-textarea v-model="form.contractConsultation" label="상담 내용" required></v-textarea>
                  <v-select v-model="form.contractStatus" :items="contractStatuses" label="계약 상태" required></v-select>
                  <v-btn color="primary" type="submit">계약 생성</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppSidebar from '@/layouts/AppSidebar.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  components: {
    AppHeader,
    AppSidebar
  },
  data() {
    return {
      form: {
        contractDate: '',
        contractExpireDate: '',
        contractPeriod: '',
        contractTotalPrice: '',
        contractPaymentAmount: '',
        contractPaymentFrequency: '',
        contractPaymentMaturityInstallment: '',
        contractCount: '',
        contractPaymentMethod: '',
        contractPayer: '',
        contractConsultation: '',
        insuranceProductId: '',
        contractStatus: '',
        contractMemberId: '',
        customId: '',
      },
      paymentFrequencies: ['Monthly', 'Quarter', 'Yearly'],
      paymentMethods: ['계좌', '신용카드'],
      contractStatuses: ['New', 'Renewals', 'Cancellation'],
    };
  },
  methods: {
    formatDateTime(date) {
      return `${date}T00:00:00`;
    },
    submitForm() {
      const router = this.$router;
      if (this.$refs.form.validate()) {
        const accessToken = localStorage.getItem('accessToken');
        const formData = {
          ...this.form,
          contractDate: this.formatDateTime(this.form.contractDate),
          contractExpireDate: this.formatDateTime(this.form.contractExpireDate)
        };
        axios.post('http://localhost:8080/api/contract/create', formData, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }).then(response => {
          alert('계약이 성공적으로 생성되었습니다.');
          router.push('/ContractList');
        }).catch(error => {
          console.error('계약 생성에 실패했습니다:', error);
          alert('계약 생성에 실패했습니다: ' + (error.response && error.response.data.message ? error.response.data.message : '서버 에러'));
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
