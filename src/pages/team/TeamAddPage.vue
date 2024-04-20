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
                <v-spacer></v-spacer>
                <span>팀명</span>
                <v-text-field v-model="form.teamName" label="팀명을 입력하세요" required></v-text-field>
                <span>팀장</span>
                <v-btn id="postcode" type="button" @click="openPostCode" value="우편번호 찾기">우편번호 찾기</v-btn>
                <span>팀장 이름</span>
                <v-text-field type="text" v-model="teamManagerName" label="팀장 이름" placeholder="이름" readonly/>
                <span>사원번호</span>
                <v-text-field type="text" v-model="teamManagerCode" placeholder="사원번호" label="사원번호" readonly/>
                <span>직급</span>
                <v-text-field type="text" v-model="rank" placeholder="사원번호" label="직급" readonly/>

                <span>팀장 이름</span>
                <v-text-field v-model="form.birthDay" label="업무개시일" type="date"  required></v-text-field>
                <span>직급</span>
                <v-combobox v-model="form.rank" label="직급을 입력하세요" :items="rank" required></v-combobox>
                <span>발령일자</span>
                <v-text-field v-model="form.birthDay" label="발령일자" type="date" required></v-text-field>
                <v-btn color="primary" type="submit">등록</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import {onMounted, ref} from 'vue';
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import axiosInstance from "@/plugins/loginaxios";

export default {
  components: { AppHeader, AppSidebar },
  setup() {
    const form = ref({
      teamManagerCode:'',
      teamName: '',
      tableColumns: [
        {title: "No", key: "id"},
        {title: "이름", key: "name"},
        {title: "사원코드", key: "salesMemberCode"},
        {title: "직급", key: "rank"},
        {title: "팀", key: "teamName"},
        {title: "팀 코드", key: "teamCode"},
        {title: "모바일", key: "phone"},
        {title: "이메일", key: "email"}
      ],
      tableRows: [],
    });
    const formatDateTime = (date) => {
      return `${date}T00:00:00`;
    };

    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      axiosInstance.get(`${baseUrl}/api/members/list/Manager`)
        .then(response => {
          const data = response.data.result;
          console.log(data)
          data.forEach((item, index) => {
            item.id = index + 1;
          });
          // tableRows에 데이터를 할당합니다.
          rows = data;
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
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
      onMounted(() => {
        fetchData();
      });

    return {
      form,
      submitForm,
    };
  }
}
</script>

<style scoped>

</style>
