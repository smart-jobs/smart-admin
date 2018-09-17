<template>
  <div class="lite">
    <data-grid :data="items" :action="true" :meta="fields" :operation="operation" @add-new="handleNew" @edit="handleEdit" @delete="handleDelete">
    </data-grid>
    <draft-dlg v-if="showForm" :visible.sync="showForm" :data="form.data" :is-new="form.isNew" @save="handleSave" @cancel="showForm = false">
    </draft-dlg>
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
        { name: 'docNo', label: '文号', required: true },
        { name: 'title', label: '标题', required: true },
        { name: 'content', label: '内容' },
        { name: 'hasReceipt', label: '是否回执' },
        { name: 'createUser', label: '发文用户' },
        { name: 'createDate', label: '创建时间' },
        { name: 'status', label: '公文状态' },
        // { name: 'receiveUnit', label: '接收单位' },
        // { name: 'attachment', label: '附件' },
        // { name: 'receiptFields', label: '回执字段' },
      ],
      operation: [
        ['edit', '编辑', 'el-icon-edit'],
        ['delete', '删除', 'el-icon-delete', true]
        ['post', '递送', 'el-icon-share', true]
      ] /* 操作类型 */
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

