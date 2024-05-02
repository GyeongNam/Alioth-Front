<template>
  <v-navigation-drawer location="left" permanent image=""
                       class="blue-lighten-5">
    <v-list>
      <v-list-item prepend-avatar="/Alioth.png">
          <v-list-item-title> Alioth </v-list-item-title>
       </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="대시보드" value="dashboard" @click="handleMenuClick(`/`);"></v-list-item>
      <v-list-item prepend-icon="mdi-network-pos" value="sales" ref="parent"  >
        <v-list-item-title v-for="(folder, index) in folders" :key="index">
          <v-list-item-title @click="handleSubMenuClick(`/Sales`);">{{ folder.title }}</v-list-item-title>
          <v-list v-if="dropDownStore.getDropdown">
            <v-list-item v-for="(subItem, subIndex) in folder.subItems" :key="subIndex" @click="this.$router.push(subItem.url.toString())">
              <v-list-item-title>{{ subItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="loginStore.memberRank === 'HQ'" prepend-icon="mdi-account-multiple" title="사원" value="shared"  @click="this.$router.push(`/SalesMembersList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-format-list-bulleted" title="게시판" value="starred"  @click="handleMenuClick(`/BoardList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-file-sign" title="계약" value="starred" @click="handleMenuClick(`/ContractList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar-check" title="일정" value="starred" @click="handleMenuClick(`/Schedule`);"></v-list-item>
      <v-list-item v-if="loginStore.memberRank === 'HQ'" prepend-icon="mdi-account-details" title="팀 목록" value="starred" @click="handleMenuClick(`/Team/List`);"></v-list-item>
      <v-list-item v-if="loginStore.memberRank === 'MANAGER'" prepend-icon="mdi-badge-account-horizontal-outline" title="팀 " value="starred" @click="handleMenuClick(`/Team/Detail/`+loginStore.memberTeamCode);"></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list>
        <span class="small-text" > 오늘도 좋은 하루 보내세요! </span>
        <v-list-item :prepend-avatar="loginStore.memberImage" @click="this.$router.push(`/SalesMembersList/Detail/${loginStore.memberCode}`);">
          <template v-if="loginStore.memberRank">
            <v-list-item-title>{{ loginStore.memberEmail }}</v-list-item-title>
            <v-row align="center" no-gutters>
              <v-col cols="11">
                <v-list-item-subtitle>{{ loginStore.memberName }}</v-list-item-subtitle>
              </v-col>
              <v-col cols="1">
                <v-btn icon @click="confirmLogout">
                  <v-icon>mdi-minus-circle</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { useDropdownStore } from '@/stores/dropDown'
import { useLoginInfoStore } from "@/stores/loginInfo";

export default {
  data() {
    return {
      dropDownStore : useDropdownStore(),
      loginStore : useLoginInfoStore(),
      folders: [
        {
          title: '매출',
          subItems: [
            {title: '순위', url: '/Sales/Ranking'},
            {title: '개인', url: '/Sales/Personal'},
            {title: '팀', url: '/Sales/Team'},
            {title: '전사', url: '/Sales/Total'},
          ]
        }
      ],
    };
  },
  mounted() {

  },
  methods: {
    handleMenuClick(route) {
      this.$router.push(route);
    },
    handleSubMenuClick(route) {
      this.dropDownStore.toggleDropdown()
      this.$router.push(route);
    },
    confirmLogout() {
      if (confirm('로그아웃하시겠습니까?')) {
        alert('로그아웃 되었습니다.');
        localStorage.removeItem('accessToken'); // 토큰 삭제
        localStorage.removeItem('refreshToken')
        this.$router.push('/Login');
        window.location.reload();
      }
    }
  }
}
</script>

<style scoped>
.small-text {
  font-size: 10px; /* 원하는 작은 크기로 조정 */
  text-align: center;
  margin: 0 auto;
  display: block;
}
.v-btn--icon {
  border-radius: 0;  /* 원형 테두리 제거 */
  padding: 0;        /* 내부 패딩 제거 */
  background: transparent; /* 배경 투명 처리 */
}

/* 필요에 따라 다음과 같이 더 구체적으로 조정할 수 있습니다 */
.v-btn--icon .v-icon {
  color: inherit;    /* 아이콘 색상을 버튼 색상과 동일하게 설정 */
}
</style>

