<template>
  <div class="mixed">
    <el-card class="left">
      <div slot="header" class="top">
        <span>标签</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew" v-if="editable"> </el-button>
      </div>
      <el-tree :data="treeData" :props="{label: 'tagname'}" @node-click="selectTag" :render-content="renderNavNode" :highlight-current="true"></el-tree>
    </el-card>
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="clearfix">
        <span>{{(current && current.tagname) || '标签用户' }}</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNewItem" :disabled="!current">添加部门/成员</el-button>
      </div>
      <data-grid :data="items" :filter="false" :meta="fields" :operation="operation" @delete="handleDelItem" >
      </data-grid>
    </el-card>
    <data-dlg :title="form.isNew?'添加标签':'修改标签'" width="400px" v-if="showForm" :visible.sync="showForm" :data="form.data" :is-new="form.isNew" :options="{'label-width':'80px', size: 'mini'}" :meta="tagFields" @save="handleSave" @cancel="showForm = false">
    </data-dlg>
    <user-select title="添加成员/部门到标签" width="400px" v-if="showSelect" :visible.sync="showSelect" @cancel="showSelect = false" @ok="handleAddItem">
    </user-select>
  </div>
</template>
<script>
import DataForm from '@/naf/data/form';
import DataDlg from '@/naf/data/form-dlg';
import DataGrid from '@/naf/data/lite-grid';
import UserSelect from '@/naf/user/user-select';
import { mapState, createNamespacedHelpers } from 'vuex';

const { mapState: _mapState, mapActions } = createNamespacedHelpers(
  'system/tag'
);

export default {
  components: {
    DataForm,
    DataDlg,
    DataGrid,
    UserSelect,
  },
  async fetch({store}) {
    // 加载部门和用户数据
    await store.dispatch('system/user/load');
    await store.dispatch('system/dept/load');
  },
  mounted() {
    this.load();
  },
  data() {
    return {
      view: 'list',
      showForm: false,
      showSelect: false,
      form: {},
      fields: [
        { name: 'name', label: '名称', required: true, listOpts: { width: 200 } },
        { name: 'path', label: '所在部门', readonly: true, formatter: this.deptPath },
      ],
      tagFields: [
        { name: 'tagid', label: 'ID', readonly: true },
        { name: 'tagname', label: '标签', required: true }
      ],
      operation: [
        ['delete', '删除', 'el-icon-delete', true],
      ] /* 操作类型 */,
      filter: undefined,
    };
  },
  computed: {
    ..._mapState(['current', 'tags', 'userlist', 'partylist']),
    ...mapState({
      depts: state => state.system.dept.dict, 
    }),
    treeData() {
      return this.tags.map(p=>({...p,id: p._id}));
    },
    editable() {
      return this.$store.state.platform === 'master';
    },
    items() {
      const items = [...this.partylist, ...this.userlist];
      return items;
    }
  },
  methods: {
    ...mapActions(['load', 'create', 'delete', 'update', 'selectTag', 'addtagusers', 'deltagusers']),
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
      this.showSelect = true;
    },
    deptPath(row, column, cellValue, index) {
      let ids = [];
      if(row.userid) {
        ids = row.department || [];
      } else {
        ids = [ row.id ];
      }
      console.log(ids);
      return ids.map(p=>String(p))
                .map(p=> (this.depts[p] && this.depts[p].path) || [])
                .map(p=>p.join(' / '))
                .join(', ');
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
      try {
        await this.$confirm(`删除标签后，标签和用户的关联信息也将删除，是否删除该标签?`, '请确认', {
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
    async handleAddItem(data) {
      this.showSelect = false;
      console.log(data);
      const userlist = data.filter(p=>p.userid != undefined).map(p=>p.userid);
      const partylist = data.filter(p=>p.userid == undefined).map(p=>p.id);
      this.addtagusers({userlist, partylist});
    },
    async handleDelItem(data) {
      const { userid, id } = data;
      const userlist = [ userid ];
      const partylist = [ id ];
      this.deltagusers({userlist, partylist});
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
      const editable = this.editable;
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <el-dropdown class="nav-btn" trigger="click" size="mini" on-command={handleCommand} >
            <span class="el-dropdown-link" on-click={clickHandler} v-show={editable}>
              <i class="naf-icons naf-icon-dian" />
            </span>
            <el-dropdown-menu class="action-menu" slot="dropdown">
              <el-dropdown-item command="edit">修改名称</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
              <el-dropdown-item divided disabled>
                标签ID: {data.tagid}
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
