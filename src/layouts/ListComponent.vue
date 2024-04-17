<template>
  <v-data-table-virtual
    :headers="columns"
    :items="rows"
    :items-length="rows.length"
    item-key="id"
    @click:row="handleRowClick"
  ></v-data-table-virtual>
</template>

<script>
export default {
  props: {
    columns: Array,
    rows: Array,
  },
  methods: {
    handleRowClick(event, item) {
      this.$emit('row-click', item);
    }
  }
};
</script>
