<template>
  <v-data-table
    :headers="columns"
    item-key="id"
    @click:row="handleRowClick"
    :items="rows"
    :items-length="rows.length"
    item-value="id"
  ></v-data-table>
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
    },
  }
};
</script>