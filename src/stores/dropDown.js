import {defineStore} from 'pinia';

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    isDropdown: false,
  }),

  getters: {
    getDropdown() {
      return this.isDropdown;
    },
  },

  actions: {
    toggleDropdown() {
      this.isDropdown = !this.isDropdown;
    },
  },
});
