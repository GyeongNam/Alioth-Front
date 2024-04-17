<template>
    <AppSidebar></AppSidebar>
    <v-main>
      <AppHeader></AppHeader>
      <v-container fluid>
        <v-card>
          <v-card-title>계약 수정</v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field label="계약 기간" v-model="contract.contractPeriod" :rules="nameRules" required></v-text-field>
              <v-select label="결제 빈도" v-model="contract.contractPaymentFrequency" :items="paymentFrequencies" :rules="nameRules" required></v-select>
              <v-text-field label="지불자" v-model="contract.contractPayer" :rules="nameRules" required></v-text-field>
              <v-text-field label="결제 방법" v-model="contract.contractPaymentMethod" :rules="nameRules" required></v-text-field>
              <v-text-field label="상담 내용" v-model="contract.contractConsultation" :rules="nameRules" required></v-text-field>
              <v-btn :disabled="!valid" color="success" @click="submit">저장</v-btn>
              <v-btn color="error" @click="cancel">취소</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import AppSidebar from "@/layouts/AppSidebar.vue";
  import AppHeader from "@/layouts/AppHeader.vue";
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  
  export default {
    components: { AppHeader, AppSidebar },
    setup() {
      const router = useRouter();
      const route = useRoute();
      const valid = ref(false);
      const contract = ref({
        contractPeriod: '',
        contractPaymentFrequency: null,
        contractPayer: '',
        contractPaymentMethod: '',
        contractConsultation: ''
      });
      const nameRules = [v => !!v || '필수 입력 사항입니다'];
      const paymentFrequencies = ['Monthly', 'Quarter', 'Yearly']; // 예시 데이터
  
      const accessToken = localStorage.getItem('accessToken');
  
      const fetchContractDetail = () => {
        const contractId = route.params.id;
        if (!contractId) {
          console.error("No contract ID found in the route parameters.");
          return;
        }
  
        axios.get(`http://localhost:8080/api/contract/detail/${contractId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(response => {
          const data = response.data.result;
          contract.value.contractPeriod = data.contractPeriod;
          contract.value.contractPaymentFrequency = data.contractPaymentFrequency;
          contract.value.contractPayer = data.contractPayer;
          contract.value.contractPaymentMethod = data.contractPaymentMethod;
          contract.value.contractConsultation = data.contractConsultation;
        }).catch(error => {
          console.error("Failed to load contract details:", error);
        });
      };
  
      onMounted(fetchContractDetail);
  
      const submit = () => {
        if (!valid.value) {
          alert("Please fill all required fields correctly.");
          return;
        }
  
        axios.patch(`http://localhost:8080/api/contract/update/${route.params.id}`, contract.value, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(() => {
          alert('Contract information has been updated successfully.');
          router.push('/ContractList');
        }).catch(error => {
          console.error("Error updating contract:", error);
        });
      };
  
      const cancel = () => {
        router.back();
      };
  
      return { contract, valid, nameRules, submit, cancel };
    }
  }
  </script>
  