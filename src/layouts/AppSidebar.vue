<template>
  <v-navigation-drawer location="left" permanent>
    <v-list>
      <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" subtitle="sandra_a88@gmail.com" title="Sandra Adams" @click="this.$router.push(`/MyPage`);"></v-list-item>
    </v-list>
    <v-list-item prepend-icon="mdi-power" @click="confirmLogout">
      </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Dashboard" value="dashboard" @click="handleMenuClick(`/`);"></v-list-item>
      <v-list-item prepend-icon="mdi-network-pos" value="sales" ref="parent"  @click="handleSubMenuClick(`/Sales`);">
        <v-list-item-title v-for="(folder, index) in folders" :key="index">
          <v-list-item-title>{{ folder.title }}</v-list-item-title>
          <v-list v-if="dropDownStore.getDropdown">
            <v-list-item v-for="(subItem, subIndex) in folder.subItems" :key="subIndex" @click="this.$router.push(subItem.url)">
              <v-list-item-title>{{ subItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" title="사원" value="shared"  @click="this.$router.push(`/SalesMembersList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-star" title="게시판" value="starred"  @click="handleMenuClick(`/BoardList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-file-sign" title="계약" value="starred" @click="handleMenuClick(`/ContractList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar-check" title="일정" value="starred" @click="handleMenuClick(`/Schedule`);"></v-list-item>
      <!-- 로그아웃 버튼 -->

    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { useDropdownStore } from '@/stores/dropDown'

export default {
  data() {
    return {
      dropDownStore : useDropdownStore(),
      folders: [
        {
          title: '매출',
          subItems: [
            {title: '개인', url: '/Sales/Personal'},
            {title: '팀', url: '/Sales/Team'},
            {title: '전사', url: '/Sales/Total'},
          ]
        }
      ]
    };
  },
  methods: {
    handleMenuClick(route) {
      this.folders.forEach(folder => {
        folder.open = true;
      });
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
        this.$router.push('/Login');
      }
    }
  }
}
</script>

<style scoped>

</style>
