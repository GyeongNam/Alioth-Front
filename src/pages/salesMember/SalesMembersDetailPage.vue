<template>
  <AppSidebar></AppSidebar>
  <v-main>
    <AppHeader></AppHeader>
    <v-container fluid>
      <h2>사원 상세 조회 페이지(관리자)</h2>
      <v-divider></v-divider>
      <v-col class="text-right">
        <v-btn variant="outlined" @click="navigateToModify">사원정보 수정</v-btn>
      </v-col>

      <!--   이미지 들어오는지 확인 해봐야함-->
      <v-img :width="300" aspect-ratio="16/9" cover :src="profile"></v-img>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>사원 코드</v-card-title>
            <v-card-text>{{ salesMemberCode }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>직급</v-card-title>
            <v-card-text>{{ rank }}</v-card-text>
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
  props: {
    salesMembersCode: {
      type: -1,
      required: true
    }
  },

  setup(props) {
    // console.log(props.salesMembersCode)

    const profile = ref('');
    const salesMemberCode = ref('salesMemberCode');
    const rank = ref('');
    const fetchData = () => {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      axiosInstance.get(`${baseUrl}/api/members/details/${props.salesMembersCode}`)
        .then(response => {
          if (response.data && response.data.result) {
            const {
              profile: profileImageUrl,
              salesMemberCode: memberCode,
              rank: memberRank,

            } = response.data.result;
            profile.value = profileImageUrl
            salesMemberCode.value = memberCode
            rank.value = memberRank
            /* .rank(member.getRank())
                 .salesMemberCode(member.getSalesMemberCode())
                 .birthDay(member.getBirthDay())
                 .performanceReview(member.getPerformanceReview())
                 .teamCode(member.getTeam() == null ? null : member.getTeam().getTeamCode())
                 .teamName(member.getTeam() == null ? null : member.getTeam().getTeamName())
                 .address(member.getAddress())
                 .officeAddress(member.getOfficeAddress())
                 .extensionNumber(member.getExtensionNumber())
                 .phone(member.getPhone())
                 .name(member.getName())
                 .email(member.getEmail())*/

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
      // salesMemberCode,
      rank
    }
  },

}
</script>

<style scoped>

</style>

