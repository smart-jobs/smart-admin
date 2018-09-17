<template>
  <div class="lite">
    <data-grid :data="items" :action="true" :meta="fields" :readonly="true" @add-new="handleNew" @edit="handleEdit" @delete="handleDelete">
        <el-button slot="action" icon="el-icon-download" type="primary" size="mini" >导出</el-button>
    </data-grid>
  </div>
</template>
<script>
import DraftDlg from '@/docflow/draft-dlg';
import DataGrid from '@/naf/data/filter-grid';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('system/tag');

export default {
  components: {
    DraftDlg,
    DataGrid
  },
  mounted() {
    this.load();
  },
  data() {
    return {
      view: 'list',
      showForm: false,
      form: {},
      passwdForm: {},
      fields: [
        { name: 'unit', label: '单位' },
        { name: 'name', label: '姓名' },
        { name: 'mobile', label: '手机号' },
        { name: 'email', label: '邮箱' },
      ],
    };
  },
  methods: {
    ...mapActions(['load', 'create', 'delete', 'update']),
    handleEdit(data) {
      this.form = { data, isNew: false };
      this.showForm = true;
    },
    handleNew() {
      const { id: deptId } = this.current || { id: 0 };
      this.form = { data: { department: [deptId] }, isNew: true };
      this.showForm = true;
    },
    async handleSave(payload) {
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
    async handleDelete(data) {
      const res = await this.delete(data);
      this.$checkRes(res, '删除数据成功');
    }
  },
  computed: {
    ...mapState(['items'])
  }
};
</script>
<style lang="less" scoped>
</style>

