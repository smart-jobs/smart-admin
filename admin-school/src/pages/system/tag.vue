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
      <data-grid :data="itemData" :filter="false" :meta="fields" @edit="handleEdit" @delete="handleDelete" >
      </data-grid>
    </el-card>
    <data-dlg :title="form.isNew?'添加标签':'修改标签'" width="400px" v-if="showForm" :visible.sync="showForm" :data="form.data" :is-new="form.isNew" :options="{'label-width':'80px', size: 'mini'}" :meta="tagFields" @save="handleSave" @cancel="showForm = false">
    </data-dlg>
  </div>
</template>
<script>
import DataForm from '@/naf/data/form';
import DataDlg from '@/naf/data/form-dlg';
import DataGrid from '@/naf/data/lite-grid';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers(
  'system/tag'
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
      tagFields: [
        { name: 'tagid', label: 'ID', readonly: true },
        { name: 'tagname', label: '标签', required: true }
      ],
      filter: undefined,
    };
  },
  computed: {
    ...mapState(['current', 'tags', 'items']),
    treeData() {
      return this.tags.map(p=>({...p,id: p._id}));
    },
    itemData() {
      if(this.filter){
        return this.items.filter(p=>{
          for(const key in this.filter){
            if(p[key] !== this.filter[key]){
              return false;
            }
          }
          return true;
        });
      }
      return this.items;
    },
    editable() {
      return this.$store.state.platform === 'master';
    }
  },
  methods: {
    ...mapActions(['load', 'create', 'delete', 'update', , 'selectTag']),
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
      this.$message('功能暂未开放...');
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
