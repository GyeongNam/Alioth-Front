<template>
  <div class="d-flex justify-center align-center" style="height: 100vh;">
    <v-container fluid>
      <v-row class="fill-height" no-gutters>
        <v-col cols="6" class="d-flex align-center justify-center">
          <img src="@/assets/2024-03-18_2.22.312.png" alt="Logo" height="400">
        </v-col>
        <v-col cols="5" class="d-flex align-center justify-center">
          <v-card class="pa-4 elevation-12" width="500" style="border-radius: 15px;">
            <v-card-title class="text-h5 blue-grey lighten-2 white--text" style="text-align: center;">
              비밀번호 변경
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form @submit.prevent="submit">
                <v-text-field v-model="employeeNumber" label="사원번호" prepend-icon="mdi-account" type="text" placeholder="사원번호를 입력해주세요" required></v-text-field>
                
                <v-row>
                  <v-col cols="8">
                    <v-text-field v-model="phone" label="연락처" prepend-icon="mdi-phone" type="text" :rules="[phoneRules]" placeholder="예: 010-1234-5678" required @input="clearVerification"></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-btn :disabled="!phonePatternTest" color="primary" @click="sendVerificationCode">인증번호 발송</v-btn>
                  </v-col>
                </v-row>
                
                <v-text-field v-if="verificationVisible" v-model="verificationCode" :class="{ 'error--text': verificationError, 'success--text': verificationSuccess }" label="인증번호 확인" prepend-icon="mdi-checkbox-marked-circle-outline" type="text" placeholder="인증번호를 입력해주세요" required @blur="verifyCode"></v-text-field>
                
                <v-text-field v-if="verified" v-model="newPassword" label="새로운 비밀번호" prepend-icon="mdi-lock" type="password" placeholder="새로운 비밀번호를 입력해주세요" required></v-text-field>
                <v-text-field v-if="verified" v-model="newPasswordConfirmation" label="새로운 비밀번호 확인" prepend-icon="mdi-lock-check" type="password" placeholder="새로운 비밀번호를 다시 입력해주세요" required></v-text-field>
                
                <v-btn v-if="verified" block large color="blue" class="white--text my-4" type="submit">확인</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';

export default {
  setup() {
    const employeeNumber = ref('');
    const phone = ref('');
    const verificationCode = ref('');
    const verificationVisible = ref(false);
    const verificationError = ref(false);
    const newPassword = ref('');
    const newPasswordConfirmation = ref('');
    const verified = ref(false);
    const verificationSuccess = ref(false);
    
    const baseUrl = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';

    const phoneRules = [
      v => !!v || '연락처 입력은 필수입니다.',
      v => (/^\d{3}-\d{4}-\d{4}$/).test(v) || '핸드폰 번호의 양식과 맞지 않습니다. 예: 010-1234-5678'
      ];

    const phonePatternTest = computed(() => /^\d{3}-\d{4}-\d{4}$/.test(phone.value));
    const formattedPhoneNumber = computed(() => {
      return phone.value.replace(/-/g, '').replace(/^010/, '+82010');
    });


    const sendVerificationCode = async () => {
      if (!phonePatternTest.value) {
        alert('연락처 형식을 확인해주세요.');
        return;
      }
      try {
        const response = await axios.post(`${baseUrl}/api/send-verification`, {
          phone: formattedPhoneNumber.value
        });
        console.log(response.data);
        alert(response.data.message);
        verificationVisible.value = true;
        verificationSuccess.value = true; // 성공 시 true로 설정
      } catch (error) {
        console.error('Error sending verification code:', error);
        alert('Failed to send verification code.');
      }
    };

    const verifyCode = async () => {
      if (!verificationSuccess.value) {
        alert('먼저 인증번호를 요청해주세요.');
        return;
      }
      try {
        const response = await axios.post(`${baseUrl}/api/verify-code`, {
          phone: formattedPhoneNumber.value,
          code: verificationCode.value
        });
        if (response.data.message === "인증에 성공하였습니다.") {
          verified.value = true;
          verificationError.value = false;
        } else {
          verificationError.value = true;
          alert('Invalid verification code.');
        }
      } catch (error) {
        verificationError.value = true;
        alert('Verification failed.');
      }
    };


    const clearVerification = () => {
      verificationVisible.value = false;
      verificationError.value = false;
      verified.value = false;
      verificationCode.value = '';
    };

    const submit = async () => {
  if (newPassword.value !== newPasswordConfirmation.value) {
    alert('새로운 비밀번호가 일치하지 않습니다.');
    return;
  }

  // memberCode를 ID로 변환하는 로직이 필요합니다.
  let memberId;
  try {
    // 백엔드로부터 memberId를 가져오는 요청
    const memberIdResponse = await axios.get(`${baseUrl}/api/members/details-by-code/${employeeNumber.value}`);
    memberId = memberIdResponse.data.id; // 이 부분이 중요합니다.
  } catch (error) {
    console.error('사원 ID 조회 오류:', error.response || error.message);
    alert('사원 ID 조회 실패.');
    return;
  }

  // 이제 memberId를 사용하여 비밀번호를 변경합니다.
  const updateUrl = `${baseUrl}/api/members/${memberId}/password`; // employeeNumber 대신 memberId를 사용합니다.
  console.log('PATCH 요청 URL:', updateUrl);

  try {
    const response = await axios.patch(updateUrl, {
      password: newPassword.value
    });
    alert(response.data.message);
  } catch (error) {
    console.error('비밀번호 변경 오류:', error.response || error.message);
    alert('비밀번호 변경 실패.');
  }
};



    return {
      employeeNumber,
      phone,
      verificationCode,
      verificationVisible,
      verificationError,
      verificationSuccess,
      newPassword,
      newPasswordConfirmation,
      verified,
      sendVerificationCode,
      verifyCode,
      submit,
      phoneRules,
      phonePatternTest,
      clearVerification,
      formattedPhoneNumber
    };
  }
};
</script>

<style scoped>
.error--text {
  color: red;
}
.success--text {
  color: green;
}
</style>
