<template>
  <div class="mixed">
    <el-card class="left" v-show="view ==  'list'">
      <div slot="header" class="top">
        <span>字典分类</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNewCatg"> </el-button>
      </div>
      <el-tree :data="treeData" :props="{label: 'name'}" @node-click="handleSetCatg" :render-content="renderNavNode" :highlight-current="true"></el-tree>
    </el-card>
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="clearfix">
        <span>{{(category && category.name) || '字典数据' }}</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew" :disabled="!category">添加字典项</el-button>
      </div>
      <data-grid ref="dataGrid" :data="itemData" :filter="false" :paging="true" :total="total" :page-size="pageSize" :meta="fields" @edit="handleEdit" @delete="handleDelete" @query="handleQuery">
      </data-grid>
    </el-card>
    <el-card class="right details" size="mini" v-else>
      <div slot="header" class="clearfix">
        <span>{{form.isNew?'添加字典项':'修改字典项' }}</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <data-form :data="form.data" :is-new="form.isNew" :meta="fields" :options="{'label-width':'120px', size: 'small'}" @save="handleSave"  @cancel="view = 'list'">
      </data-form>
    </el-card>
    <data-dlg title="字典类别" width="400px" v-if="catgDlg" :visible.sync="catgDlg" :data="catgForm.data" :is-new="catgForm.isNew" 
      :options="{'label-width':'80px', size: 'mini'}" :meta="catgFields" @save="handleSaveCatg" @cancel="catgDlg = false">
    </data-dlg>
  </div>
</template>
<script>
import DataForm from '@/naf/data/form';
import DataDlg from '@/naf/data/form-dlg';
import DataGrid from '@/naf/data/filter-grid';
import DeptTree from '@/naf/user/dept-tree';
import { createNamespacedHelpers } from 'vuex';
import * as types from '@/store/system/.dict';
import config from '@/utils/config.js';
const { pageSize = 10 } = config;

const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  'system/dict'
);

export default {
  components: {
    DataForm,
    DataDlg,
    DataGrid,
    DeptTree
  },
  async fetch({store}) {
    // 加载字典数据
    await store.dispatch('naf/dict/load', 'usage');
  },
  mounted() {
    this.loadCatg();
  },
  data() {
    return {
      view: 'list',
      catgDlg: false,
      catgForm: {},
      form: {},
      fields: [
        { name: 'code', label: '代码', editable: false, required: true },
        { name: 'name', label: '名称', required: true },
        { name: 'category', label: '类别', readonly: true, order: 100 },
        { name: 'group', label: '子类', filter: true },
        { name: 'status', label: '状态', filter: true, formatter: 'dict:usage', listOpts: { filterable: true } },
      ],
      catgFields: [
        { name: 'code', label: '代码', editable: false, required: true },
        { name: 'name', label: '名称', required: true },
        { name: 'key', label: '别名', required: true , formOpts: { placeholder: '字典类别的别名，由字母数字组成' } },
      ],
      filter: undefined,
    };
  },
  computed: {
    ...mapState(['category', 'categories', 'items', 'total']),
    treeData() {
      return this.categories.map(p=>({...p,id: p._id}));
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
    }
  },
  methods: {
    ...mapActions(['loadCatg', 'createCatg', 'deleteCatg', 'updateCatg', 'loadItem', 'createItem', 'deleteItem', 'updateItem', 'selectCatg']),
    ...mapMutations({ setCategory: types.CATG_SELECTED }),
    handleNew() {
      if(!this.category) return ;
      this.form = { data: { category: this.category.code }, isNew: true };
      this.view = 'details';
    },
    handleNewCatg() {
      this.catgForm = { data: {}, isNew: true };
      this.catgDlg = true;
    },
    handleEdit(data) {
      this.form = { data, isNew: false };
      this.view = 'details';
    },
    handleEditCatg(data) {
      this.catgForm = { data, isNew: false };
      this.catgDlg = true;
    },
    handleSetCatg(data) {
      this.selectCatg(data);
      this.$refs['dataGrid'].resetPage();
    },
    handleQuery({filter, paging}) {
      this.filter = filter;
      this.loadItem(paging);
      this.currentPage = paging.page;
    },
    async handleSave(payload) {
      let res;
      if (payload.isNew) {
        res = await this.createItem(payload.data);
      } else {
        res = await this.updateItem(payload.data);
      }
      if (this.$checkRes(res, '数据保存成功')) {
        this.view = 'list';
      }
    },
    async handleSaveCatg(payload) {
      let res, msg;
      if (payload.isNew) {
        res = await this.createCatg(payload.data);
        msg = '创建字典分类成功';
      } else {
        res = await this.updateCatg(payload.data);
        msg = '修改字典分类成功';
      }
      if (this.$checkRes(res, msg)) {
        this.catgDlg = false;
      }
    },
    async handleDelete(data) {
      const res = await this.deleteItem(data);
      this.$checkRes(res, '删除数据成功');
    },
    async handleDeleteCatg(data) {
      try {
        await this.$confirm(`是否删除字典分类?`, '请确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const res = await this.deleteCatg(data);
        this.$checkRes(res, '删除字典分类成功');
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
        this.handleEditCatg(data);
      } else if (cmd === 'delete') {
        this.handleDeleteCatg(data);
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
                类别代码: {data.code}
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
.right.list {
  /deep/ .el-card__body {
    padding: 0;
  }
}
</style>
