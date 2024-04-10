<template>
  <v-navigation-drawer location="left" permanent>
    <v-list>
      <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" subtitle="sandra_a88@gmailcom" title="Sandra Adams" @click="this.$router.push(`/MyPage`);"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="Dashboard" value="myfiles" @click="this.$router.push(`/`);"></v-list-item>
<!--      <v-list-item prepend-icon="mdi-network-pos" title="매출" value="starred" @click="this.$router.push(`/Sales`)" id="parent"></v-list-item>-->
<!--        <v-menu v-if="showDropdown" activator="parent">
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index" @click="navigateTo(item.title)">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>-->
      <v-list-item prepend-icon="mdi-network-pos" title="매출" value="sales" @click="toggleSubMenu" id="parent">
        <v-list-item-content @click="toggleSubMenu">
<!--          <v-list-item-title>매출</v-list-item-title>-->
        </v-list-item-content>
        <v-list-item-group v-if="showSubMenu">
          <v-list-item v-for="(item, index) in items" :key="index" @click="navigateTo(item.title)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" title="사원" value="shared"  @click="this.$router.push(`/SalesMembersList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-star" title="게시판" value="starred"  @click="this.$router.push(`/BoardList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-file-sign" title="계약" value="starred" @click="this.$router.push(`/ContractList`);"></v-list-item>
      <v-list-item prepend-icon="mdi-calendar-check" title="일정" value="starred" @click="this.$router.push(`/Schedule`);"></v-list-item>
<!--      <v-list-item prepend-icon="mdi-star" title="보험상품" value="starred"></v-list-item>-->
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  data: () => ({
    items: [
      { title: 'Personal' },
      { title: 'Team' },
      { title: 'Company' },

    ],
  }),
  methods: {
    navigateTo(title) {
      let path = title;
      switch(title) {
        case 'Personal':
          path = 'Personal';
          break;
        case 'Team':
          path = 'Team';
          break;
        case 'Company':
          path = 'Total';
          break;
        default:
          path = '';
      }
      this.$router.push(`/Sales/${path}`);
    }
  },
  setup() {
    return {}
  }
}
</script>

<style scoped>

</style>
