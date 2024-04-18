<template>

    <v-data-table
      :headers="columns"
      :items="rows"
      :items-length="10"
      item-value="id"
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
    }
  },
};
</script>
