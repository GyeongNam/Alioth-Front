<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <v-col class="text-right">
        <v-btn variant="outlined" @click="navigateToModify">사원정보 수정</v-btn>
      </v-col>
      <!--   이미지 들어오는지 확인 해봐야함-->
      <v-col cols="12" md="12">
        <v-card>
          <v-card-title>사진</v-card-title>
          <v-img :width="300" aspect-ratio="16/9" cover :src="profile"></v-img>
        </v-card>
      </v-col>
      <v-row>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>이름</v-card-title>
            <v-card-text>{{ name }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>사원 코드</v-card-title>
            <v-card-text>{{ salesMembersCode }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>직급</v-card-title>
            <v-card-text>{{ rank }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>휴대전화</v-card-title>
            <v-card-text>{{ phone }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>이메일</v-card-title>
            <v-card-text>{{ email }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>생년월일</v-card-title>
            <v-card-text>{{ birthDay }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>자택 주소</v-card-title>
            <v-card-text>{{ address }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>사무실 위치</v-card-title>
            <v-card-text>{{ officeAddress }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>내선 번호</v-card-title>
            <v-card-text>{{ extensionNumber }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>고과평가</v-card-title>
            <v-card-text>{{ performanceReview }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import AppSidebar from "@/layouts/AppSidebar.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import axiosInstance from "@/plugins/loginaxios";
import router from "@/router";
import {onMounted, ref} from "vue";

export default {
  components: {AppHeader, AppSidebar},
  props: ["salesMembersCode"],
  setup(props) {
    const profile = ref('');
    const rank = ref('');
    const name = ref('');
    const phone = ref('');
    const email = ref('');
    const birthDay = ref('');
    const extensionNumber = ref('');
    const address = ref('');
    const officeAddress = ref('');
    const performanceReview = ref('');
    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      axiosInstance.get(`${baseUrl}/api/members/details/${props.salesMembersCode}`)
        .then(response => {
          if (response.data && response.data.result) {
            const {
              profile: profileImageUrl,
              rank: memberRank,
              birthDay: birthday,
              name: memberName,
              phone: mobile,
              email: emailAddress,
              extensionNumber: extensionN,
              address: homeAddress,
              officeAddress: office,
              performanceReview: pr,
            } = response.data.result;

            profile.value = profileImageUrl
            rank.value = memberRank
            birthDay.value = birthday
            name.value = memberName
            phone.value = mobile
            email.value = emailAddress
            address.value = homeAddress
            extensionNumber.value = extensionN
            officeAddress.value = office
            performanceReview.value = pr

          } else {
            console.error('Empty response or missing result data');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };

    function navigateToModify(event, {item}) {
      console.log(item)
      router.push({path: `/SalesMembersList/Modify/${item.salesMemberCode}`});
    }

    /* function navigateToAdd() {
       router.push(`/SalesMembersList/Add`);
     }*/
    onMounted(() => {
      fetchData();
    });

    return {
      navigateToModify,
      profile,
      rank,
      birthDay,
      name,
      phone,
      email,
      address,
      extensionNumber,
      officeAddress,
      performanceReview
    }
  },

}
</script>

<style scoped>

</style>

