import {defineStore} from 'pinia';

export const useLoginInfoStore = defineStore('loginInfo', {
  state: () => ({
    memberCode: -1,
    memberRank: "",
    memberTeamCode: "",
  }),

  getters: {
    getMemberCode() {
      return this.$state.memberCode;
    },
    getMemberRank() {
      return this.$state.memberRank;
    },
    getMemberTeamCode() {
      return this.$state.memberTeamCode;
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
