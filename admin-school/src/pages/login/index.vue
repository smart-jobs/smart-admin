<template>
  <code-select category="unit" :value="unit" placeholder="所在单位" @change="selectUnit">
  </code-select>
</template>

<script>
import CodeSelect from '@/naf/data/code-select';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapMutations } = createNamespacedHelpers('login');

export default {
  components: {
    CodeSelect,
  },
  methods: {
    ...mapMutations({ selectUnit: 'SELECT_UNIT' }),
  },
  computed: {
    ...mapState(['unit']),
  }
};
</script>

<style lang="less" scoped>
  .el-select {
    width: 160px;
  }
</style>

