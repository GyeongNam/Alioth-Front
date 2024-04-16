<template>

    <v-data-table-virtual
      :headers="columns"
      :items="rows"
      :items-length="10"
      item-value="name"
    ></v-data-table-virtual>
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
/*  methods: {
    handleRowClick(row) {
      this.$emit('row-click', row); // 이벤트를 발생시킵니다.
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
