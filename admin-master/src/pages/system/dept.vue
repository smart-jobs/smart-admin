<template>
  <div class="mixed">
    <el-card class="left" v-show="view ==  'list'">
      <div slot="header" class="top">
        <span>{{rootName}}</span>
        <el-tooltip content="取消选择">
          <i class="naf-icons naf-icon-clearup" style="float: right; padding: 3px 0" @click="resetCurrent()" />
        </el-tooltip>
        <!-- <el-button icon="el-icon-edit" style="float: right; padding: 3px 0" type="text" @click="setCurrent()"> </el-button> -->
      </div>
      <dept-tree ref="dept-tree" @selected="setCurrent" :data-items="items"></dept-tree>
    </el-card>
    <el-card class="right list" size="mini" v-if="view ==  'list'">
      <div slot="header" class="clearfix">
        <span>{{(current && current.name) || '&nbsp;' }}</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew">添加子部门 </el-button>
      </div>
      <data-grid :data="list" :filter="false" :meta="fields" @edit="handleEdit" @delete="handleDelete">
      </data-grid>
    </el-card>
    <el-card class="right details" size="mini" v-else>
      <div slot="header" class="clearfix">
        <span>{{form.isNew?'添加部门':'修改部门' }}</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <data-form :data="form.data" :is-new="form.isNew" :meta="fields" :rules="rules" :options="{'label-width':'120px', size: 'small'}" @save="handleSave" @cancel="view = 'list'">
      </data-form>
    </el-card>
  </div>
</template>
<script>
import DataForm from '@/naf/data/form';
import DataGrid from '@/naf/data/lite-grid';
import DeptTree from '@/naf/user/dept-tree';
import { createNamespacedHelpers } from 'vuex';
import config from '@/config';
import * as types from '@/store/system/.dept';

const { rootName } = config;

const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  'system/dept'
);

export default {
  components: {
    DataForm,
    DataGrid,
    DeptTree
  },
  mounted() {
    this.load();
  },
  data() {
    return {
      rootName,
      view: 'list',
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      fields: [
        { name: 'id', label: '部门ID', editable: false },
        { name: 'parentid', label: '上级部门ID', readonly: true, order: 100 },
        {
          field: { name: 'name', label: '部门名称', required: true },
          slots: ['list', 'form', 'filter']
        }
      ]
    };
  },
  methods: {
    ...mapActions(['load', 'create', 'delete', 'update']),
    ...mapMutations({ setCurrent: types.SELECTED }),
    handleEdit(data) {
      this.form = { data, isNew: false };
      this.view = 'details';
    },
    handleNew() {
      const { id: parentid } = this.current || { id: 0 };
      this.form = { data: { parentid }, isNew: true };
      this.view = 'details';
    },
    resetCurrent() {
      this.$refs['dept-tree'].setCurrentKey(null);
      this.setCurrent();
    },
    async handleSave(payload) {
      let res;
      if (payload.isNew) {
        res = await this.create(payload.data);
      } else {
        res = await this.update(payload.data);
      }
      if (this.$checkRes(res, '数据保存成功')) {
        this.view = 'list';
      }
    },
    async handleDelete(data) {
      try {
        await this.$confirm(`是否删除此部门?`, '请确认', {
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
    }
  },
  computed: {
    ...mapState(['current', 'items']),
    list() {
      const { id } = this.current || { id: 0 };
      return this.items.filter(p => p.parentid === id);
    }
  }
};
</script>
<style lang="less" scoped>
@import './style/mixed.less';
</style>
