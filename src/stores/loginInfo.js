import {defineStore} from 'pinia';

export const useLoginInfoStore = defineStore('loginInfo', {
  state: () => ({
    memberCode: -1,
  }),

  getters: {
    getMemberCode() {
      return this.$state.memberCode;
    },
  },

  actions: {
    toggleDropdown() {
      this.isDropdown = !this.$state.isDropdown;
    },
  },
  persist: {
    enabled: true
  }
});
