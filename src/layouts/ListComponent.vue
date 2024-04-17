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
  /*
 methods: {
   handleRowClick(item) {
     console.log(item.id)
     this.$emit('row-click', item); // 이벤트를 발생시킵니다.
   }
 },

 computed: {
   getColumns() {
     return this.columns;
   },
   getRows() {
     return this.rows;
   }
 },*/
};
</script>
