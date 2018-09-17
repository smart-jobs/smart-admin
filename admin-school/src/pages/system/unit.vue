<template>
  <div class="mixed">
    <el-card class="left">
      <div slot="header" class="top">
        <span>省内高校</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew"> </el-button>
      </div>
      <el-tree :data="treeData" :props="{label: 'unitname'}" @node-click="selectUnit" :render-content="renderNavNode" :highlight-current="true"></el-tree>
    </el-card>
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="clearfix">
        <span>{{(current && current.unitname) || '单位管理员' }}</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNewItem" :disabled="!current">添加部门/成员</el-button>
      </div>
      <data-grid :data="units" :filter="false" :meta="fields" @edit="handleEdit" @delete="handleDelete" >
      </data-grid>
    </el-card>
    <data-dlg :title="form.isNew?'添加单位':'修改单位'" width="400px" v-if="showForm" :visible.sync="showForm" :data="form.data" :is-new="form.isNew" :options="{'label-width':'80px', size: 'mini'}" :meta="unitFields" @save="handleSave" @cancel="showForm = false">
    </data-dlg>
  </div>
</template>
<script>
import DataForm from '@/naf/data/form';
import DataDlg from '@/naf/data/form-dlg';
import DataGrid from '@/naf/data/lite-grid';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers(
  'system/unit'
);

export default {
  components: {
    DataForm,
    DataDlg,
    DataGrid,
  },
  async fetch({store}) {
    // 加载字典数据
    // await store.dispatch('naf/dict/load', 'usage');
  },
  mounted() {
    this.load();
  },
  data() {
    return {
      view: 'list',
      showForm: false,
      form: {},
      fields: [
        { name: 'name', label: '名称', required: true },
        { name: 'dept', label: '部门', readonly: true },
      ],
      unitFields: [
        { name: 'unitid', label: '院校代码', required: true, editable: true },
        { name: 'unitname', label: '院校名称', required: true },
        { name: 'createUser', label: '默认用户', editable: true, formOpts: { inputType: 'checkbox', placeholder: '自动创建默认管理员'} }
      ],
      filter: undefined,
    };
  },
  computed: {
    ...mapState(['current', 'units', 'users']),
    treeData() {
      return this.units.map(p=>({...p,id: p._id}));
    },
  },
  methods: {
    ...mapActions(['load', 'create', 'delete', 'update', , 'selectUnit']),
    handleEdit(data) {
      this.form = { data, isNew: false };
      this.showForm = true;
    },
    handleNew() {
      const { id: deptId } = this.current || { id: 0 };
      this.form = { data: { department: [deptId] }, isNew: true };
      this.showForm = true;
    },
    handleNewItem() {
      this.$message('功能暂未实现...');
    },
    async handleSave(payload) {
      let res, msg;
      if (payload.isNew) {
        res = await this.create(payload.data);
        msg = '添加数据成功';
      } else {
        res = await this.update(payload.data);
        msg = '修改数据成功';
      }
      if (this.$checkRes(res, msg)) {
        this.showForm = false;
      }
    },
    async handleDelete(data) {
      try {
        await this.$confirm(`删除单位后，该单位相关数据无法进行管理，是否删除该单位?`, '请确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const res = await this.delete(data);
        this.$checkRes(res, '删除数据成功');
      } catch (err) {
        if (err == 'cancel') {
          this.$message({
            type: 'info',
            message: `已取消删除`
          });
        }
      }
    },
    handleNavCmd(cmd, data) {
      console.debug('nav command:', cmd, data);
      if(cmd === 'edit') {
        this.handleEdit(data);
      } else if (cmd === 'delete') {
        this.handleDelete(data);
      }
    },
    renderNavNode(h, { node, data /* , store */ }) {
      const clickHandler = e => {
        console.debug('show nav dropdown:', data);
        e.stopPropagation();
      };
      const handleCommand = (cmd) => {
        this.handleNavCmd(cmd, data);
      }
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <el-dropdown class="nav-btn" trigger="click" size="mini" on-command={handleCommand}>
            <span class="el-dropdown-link" on-click={clickHandler}>
              <i class="naf-icons naf-icon-dian" />
            </span>
            <el-dropdown-menu class="action-menu" slot="dropdown">
              <el-dropdown-item command="edit">修改名称</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
              <el-dropdown-item divided disabled>
                ID: {data.unitid}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      );
    }
  },
};
</script>
<style lang="less" scoped>
@import './style/mixed.less';

.left {
  /deep/ .el-card__body {
    padding: 0;
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content {
    background-color: #409eff;
    color: white;
    .naf-icon-dian {
      display: inline;
      color: white;
    }
  }
  /deep/ .naf-icon-dian {
    display: none;
  }
  /deep/ .el-tree-node__content:hover .naf-icon-dian {
    display: inline;
  }
}
</style>
