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
      <dept-tree ref="dept-tree" @selected="setCurrent" :data-items="deptItems"></dept-tree>
    </el-card>
    <el-card class="right list" size="mini" v-if="view ==  'list'">
      <div slot="header" class="clearfix">
        <span>{{(current && current.name) || '全部用户' }}</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNew">添加用户 </el-button>
      </div>
      <data-grid :data="list" :filter="true" :meta="fields" :operation="operation" @edit="handleEdit" @delete="handleDelete" @passwd="handlePassOpen">
      </data-grid>
    </el-card>
    <el-card class="right details" size="mini" v-else-if="view ==  'details'">
      <div slot="header" class="clearfix">
        <span>{{form.isNew?'添加用户':'修改用户' }}</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <data-form :data="form.data" :is-new="form.isNew" :meta="fields" :rules="rules" :options="{'label-width':'120px', size: 'small'}" @save="handleSave" @cancel="view = 'list'">
      </data-form>
    </el-card>
    <el-card class="right passwd" size="mini" v-else-if="view ==  'passwd'">
      <div slot="header" class="clearfix">
        <span>设置用户密码</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <data-form ref="passwd" :data="passwdForm" :meta="passwdFields" :options="{'label-width':'120px', size: 'small'}" @save="handlePassSave" @cancel="view = 'list'">
      </data-form>
    </el-card>
  </div>
</template>
<script>
import DataForm from '@/naf/data/form';
import DataGrid from '@/naf/data/filter-grid';
import DeptTree from '@/naf/user/dept-tree';
import { createNamespacedHelpers } from 'vuex';
import config from '@/config';
import * as types from '@/store/system/.dept';

const { rootName } = config;

const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  'system/user'
);
const {
  mapState: mapDeptState,
  mapActions: mapDeptActions
} = createNamespacedHelpers('system/dept');

export default {
  components: {
    DataForm,
    DataGrid,
    DeptTree
  },
  async fetch({store}) {
    // 加载字典数据
    await store.dispatch('naf/dict/load', 'status');
  },
  mounted() {
    this.loadDept();
    this.load();
  },
  data() {
    const checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.$refs['passwd'].form.confirm !== '') {
          this.$refs['passwd'].validateField('confirm');
        }
        callback();
      }
    };
    const checkConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.$refs['passwd'].form.newpass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      rootName,
      view: 'list',
      form: {},
      passwdForm: {},
      rules: {
        email: [
          {
            type: 'email',
            message: '请输入有效的电子邮件地址',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            type: 'string',
            pattern: /\d{11}/,
            message: '请输入有效的手机号码',
            trigger: 'blur'
          }
        ]
      },
      fields: [
        { name: 'name', label: '姓名', required: true, filter: true },
        {
          name: 'userid',
          label: '帐号',
          required: true,
          editable: false,
          filter: true,
          formOpts: { placeholder: '用户唯一标识，设定后不支持修改' }
        },
        { name: 'gender', label: '性别' },
        { name: 'position', label: '职位' },
        { name: 'mobile', label: '手机号', filter: true },
        { name: 'telephone', label: '电话' },
        { name: 'email', label: '电子邮件' },
        { name: 'status', label: '用户状态', formatter: 'dict:status' }
      ],
      operation: [
        ['edit', '编辑', 'el-icon-edit'],
        ['delete', '删除', 'el-icon-delete', true],
        ['passwd', '设置密码', 'el-icon-setting']
      ] /* 操作类型 */,
      passwdFields: [
        { name: 'name', label: '姓名', readonly: true },
        { name: 'userid', label: '帐号', readonly: true },
        {
          name: 'newpass',
          label: '密码',
          required: true,
          formOpts: { inputType: 'password' },
          rules: [{ validator: checkPass, trigger: 'blur' }],
        },
        {
          name: 'confirm',
          label: '确认',
          required: true,
          formOpts: { inputType: 'password' },
          rules: [{ validator: checkConfirm, trigger: 'blur' }],
        }
      ]
    };
  },
  methods: {
    ...mapDeptActions({ loadDept: 'load' }),
    ...mapActions(['load', 'create', 'delete', 'update', 'passwd']),
    ...mapMutations({ setCurrent: types.SELECTED }),
    handleEdit(data) {
      this.form = { data, isNew: false };
      this.view = 'details';
    },
    handleNew() {
      const { id: deptId } = this.current || { id: 0 };
      this.form = { data: { department: [deptId] }, isNew: true };
      this.view = 'details';
    },
    resetCurrent() {
      this.$refs['dept-tree'].setCurrentKey(null);
      this.setCurrent();
    },
    async handleSave(payload) {
      let res, msg;
      if (payload.isNew) {
        res = await this.create(payload.data);
        msg = '用户添加成功';
      } else {
        res = await this.update(payload.data);
        msg = '用户信息修改成功';
      }
      if (this.$checkRes(res, msg)) {
        this.view = 'list';
      }
    },
    async handleDelete(data) {
      const res = await this.delete(data);
      this.$checkRes(res, '删除数据成功');
    },
    handlePassOpen({ name, userid }) {
      this.passwdForm = { name, userid };
      this.view = 'passwd';
    },
    async handlePassSave({ data }) {
      const res = await this.passwd(data);
      if (this.$checkRes(res, '用户密码设置成功')) {
        this.view = 'list';
      }
    }
  },
  computed: {
    ...mapDeptState({ currentDept: 'current', deptItems: 'items' }),
    ...mapState(['current', 'items']),
    list() {
      const { id } = this.current || { id: 0 }; // deptartment_id
      return this.items.filter(
        p => id === 0 || (p.department && p.department.includes(id))
      );
    }
  }
};
</script>
<style lang="less" scoped>
@import './style/mixed.less';
.right.list /deep/ .el-card__body {
  padding: 0;
}
</style>

