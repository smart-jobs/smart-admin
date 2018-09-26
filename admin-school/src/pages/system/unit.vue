<template>
  <div class="mixed">
    <el-card class="left" v-show="view == 'list'">
      <div slot="header" class="top">
        <span>省内高校</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNewUnit"> </el-button>
      </div>
      <el-tree :disabled="true" :data="treeData" :props="{label: 'name'}" @node-click="selectUnit" :render-content="renderNavNode" :highlight-current="true"></el-tree>
    </el-card>
    <el-card class="right list" size="mini" v-if="view == 'list'">
      <div slot="header" class="clearfix">
        <span>{{(current && current.name) || '单位管理员' }}</span>
        <el-button icon="el-icon-plus" style="float: right; padding: 3px 0" type="text" @click="handleNewUser" :disabled="!current">添加管理员</el-button>
      </div>
      <data-grid :data="users" :filter="false" :meta="fields" @edit="handleEditUser" @delete="handleDeleteUser" @passwd="handlePassOpen" :operation="operation">
      </data-grid>
    </el-card>
    <el-card class="right details" size="mini" v-else-if="view ==  'details'">
      <div slot="header" class="clearfix">
        <span>{{userForm.isNew?'添加管理员':'修改管理员' }}</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <data-form :data="userForm.data" :is-new="userForm.isNew" :meta="fields" :rules="rules" :options="{'label-width':'120px', size: 'small'}" @save="handleSaveUser" @cancel="view = 'list'">
      </data-form>
    </el-card>
    <el-card class="right passwd" size="mini" v-else-if="view ==  'passwd'">
      <div slot="header" class="clearfix">
        <span>设置管理员密码</span>
        <el-button icon="el-icon-arrow-left" style="float: right; padding: 3px 10px;" type="text" @click="view = 'list'">返回</el-button>
      </div>
      <data-form ref="passwd" :data="passwdForm" :meta="passwdFields" :options="{'label-width':'120px', size: 'small'}" @save="handlePassSave" @cancel="view = 'list'">
      </data-form>
    </el-card>
    <data-dlg :title="form.isNew?'添加单位':'修改单位'" width="400px" v-if="showDlg" :visible.sync="showDlg" :data="form.data" :is-new="form.isNew" :options="{'label-width':'80px', size: 'mini'}" :meta="unitFields" @save="handleSaveUnit" @cancel="showDlg = false">
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
      view: 'list',
      showDlg: false,
      form: {},
      userForm: {},
      passwdForm: {},
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
      unitFields: [
        { name: 'code', label: '院校代码', required: true, editable: true },
        { name: 'name', label: '院校名称', required: true },
        { name: 'createUser', label: '默认用户', editable: true, formOpts: { inputType: 'checkbox', placeholder: '自动创建默认管理员'} }
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
  computed: {
    ...mapState(['current', 'units', 'users']),
    treeData() {
      return this.units.map(p=>({...p,id: p._id}));
    },
  },
  methods: {
    ...mapActions(['load', 'create', 'delete', 'update', 'selectUnit', 'createUser', 'deleteUser', 'updateUser', 'passwd']),
    handleEditUnit(data) {
      this.form = { data, isNew: false };
      this.showDlg = true;
    },
    handleNewUnit() {
      const { id: deptId } = this.current || { id: 0 };
      this.form = { data: { department: [deptId] }, isNew: true };
      this.showDlg = true;
    },
    async handleSaveUnit(payload) {
      let res, msg;
      if (payload.isNew) {
        res = await this.create(payload.data);
        msg = '添加数据成功';
      } else {
        res = await this.update(payload.data);
        msg = '修改数据成功';
      }
      if (this.$checkRes(res, msg)) {
        this.showDlg = false;
      }
    },
    async handleDeleteUnit(data) {
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
        this.handleEditUnit(data);
      } else if (cmd === 'delete') {
        this.handleDeleteUnit(data);
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
                ID: {data.code}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      );
    },
    // 用户管理相关方法
    handleEditUser(data) {
      this.userForm = { data, isNew: false };
      this.view = 'details';
    },
    handleNewUser() {
      this.userForm = { data: { department: [0] }, isNew: true };
      this.view = 'details';
    },
    async handleSaveUser(payload) {
      let res, msg;
      if (payload.isNew) {
        res = await this.createUser(payload.data);
        msg = '用户添加成功';
      } else {
        res = await this.updateUser(payload.data);
        msg = '用户信息修改成功';
      }
      if (this.$checkRes(res, msg)) {
        this.view = 'list';
      }
    },
    async handleDeleteUser(data) {
      const res = await this.deleteUser(data);
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
