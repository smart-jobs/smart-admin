<template>
  <div class="lite">
    <data-grid :data="items" :meta="fields" :operation="operation" @open="handleOpen">
    </data-grid>
  </div>
</template>
<script>
import CordInfo from '@/jobs/cord-info';
import DataGrid from '@/naf/data/filter-grid';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('jobs/corp');

export default {
  components: {
    CordInfo,
    DataGrid
  },
  async mounted() {
    await this.queryReg({ status: 1 });
  },
  data() {
    return {
      view: 'list',
      showForm: false,
      form: {},
      fields: [
        { name: 'corpname', label: '企业名称', required: true },
        { name: 'info.city.name', label: '所在城市' },
        { name: 'info.scale.name', label: '企业规模' },
        { name: 'info.nature.name', label: '企业性质' },
        { name: 'info.industry.name', label: '所属行业' },
        { name: 'contact.person', label: '联系人' },
        { name: 'contact.mobile', label: '手机' },
      ],
      operation: [
        ['open', '审核'],
      ] /* 操作类型 */
    };
  },
  methods: {
    ...mapActions(['queryReg', 'reviewReg']),
    handleOpen(data) {
      this.form = { data };
      this.showForm = true;
    },
    async handleReview(payload) {
      let res, msg;
      if (payload.isNew) {
        res = await this.create(payload.data);
        msg = '标签添加成功';
      } else {
        res = await this.update(payload.data);
        msg = '标签修改成功';
      }
      if (this.$checkRes(res, msg)) {
        this.showForm = false;
      }
    },
  },
  computed: {
    ...mapState(['items', 'current'])
  }
};
</script>
<style lang="less" scoped>
</style>

