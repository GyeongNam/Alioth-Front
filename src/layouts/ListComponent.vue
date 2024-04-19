<template>
  <v-data-table
    :headers="columns"
    :items="rows"
    :items-length="rows.length"
    item-value="id"
    :show-select="showCheckbox"
  ></v-data-table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
  },
};
</script>
