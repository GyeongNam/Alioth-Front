<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-text>
              <v-form ref="form" @submit.prevent="submitForm">
                <span>사진</span>
                <v-img v-if="form.imageUrl" :width="300" aspect-ratio="16/9" cover :src="form.imageUrl" alt="Selected Image"></v-img>
                <input type="file" @change="handleFileUpload">
                <v-spacer></v-spacer>
                <span>이름</span>
                <v-text-field v-model="form.name" label="이름을 입력하세요" required></v-text-field>
                <span>비밀번호</span>
                <v-text-field v-model="form.password" label="비밀번호를 입력하세요" type="password" required></v-text-field>
                <span>이메일</span>
                <v-text-field v-model="form.email" label="이메일을 입력하세요"  required></v-text-field>
                <span>직급</span>
                <v-combobox v-model="form.rank" label="직급을 입력하세요" :items="rank" required></v-combobox>
                <span>휴대폰번호</span>
                <v-text-field v-model="form.phone" label="휴대폰 번호를 입력하세요" type="number"  required></v-text-field>
                <span>생년월일</span>
                <v-text-field v-model="form.birthDay" label="생년월일" type="date" required></v-text-field>
                <span>주소</span>
                <v-spacer></v-spacer>
                <v-text-field type="text" v-model="zoneCode" placeholder="우편번호" readonly/>
                <v-btn id="postcode" type="button" @click="openPostCode" value="우편번호 찾기">우편번호 찾기</v-btn><br>
                <v-text-field type="text" v-model="roadAddress" placeholder="도로명주소" readonly/>
<!--                <v-text-field type="text" v-model="code" placeholder="지번주소" readonly/>-->
                <span id="guide" style="color:#999;display:none"></span>
                <v-text-field type="text" v-model="detailAddress" placeholder="상세주소"/>
<!--                <v-select v-model="form.address" label="주소" required></v-select>-->
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit">사원 추가</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { ref } from 'vue';
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import axiosInstance from "@/plugins/loginaxios";

export default {
  components: { AppHeader, AppSidebar },
  setup() {
    const form = ref({
      name: '',
      email: '',
      phone: '',
      password: 'a1234567!',
      birthDay: '',
      address: '',
      imageUrl: '',
      rank : ''
    });
    const rank = ['FP', 'MANAGER', 'HQ']
    const zoneCode = ref('')
    const roadAddress = ref('')
    const detailAddress = ref('')
    const formatDateTime = (date) => {
      return `${date}T00:00:00`;
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      form.value.imageUrl = URL.createObjectURL(file);
    };

    function openPostCode(){
      new window.daum.Postcode({
        oncomplete: (data) => {
          this.zoneCode = data.zoneCode
          this.roadAdress = data.roadAdress
        },
      }).open();
    }

    const submitForm = () => {
      const router = this.$router; // this가 여기서 정의되지 않았다는 오류가 발생할 수 있습니다. 이 부분을 수정해야 합니다.
      if (this.$refs.form.validate()) {
        const formData = {
          ...form.value,
          birthDay: formatDateTime(form.value.birthDay)
        };
        const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
        axiosInstance.post(`${baseUrl}/api/members/create`, formData)
          .then(response => {
            alert('계약이 성공적으로 생성되었습니다.');
            router.push('/SalesMembersList');
          }).catch(error => {
          console.error('입력 내용을 확인해주세요', error);
          alert('사원 추가에 실패했습니다: ' + (error.response && error.response.data.message ? error.response.data.message : '서버 에러'));
        });
      }
    };

    return {
      zoneCode,
      roadAddress,
      detailAddress,
      form,
      rank,
      handleFileUpload,
      submitForm,
      openPostCode
    };
  }
}
</script>

<style scoped>

</style>
