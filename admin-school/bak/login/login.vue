<template>
  <div class="container" v-show="showLogin">
    <div class="top">
      <div class="header">
        <img alt="" class="logo" src="~/assets/logo.svg" />
        <span class="title">{{productName}}</span>
      </div>
      <p class="desc">{{description}}</p>

    </div>
    <el-form class="main" :model="loginForm" :rules="rules" ref="loginForm">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="naf-icons naf-icon-user">
          <template slot="append">@
            <nuxt-child/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" v-model="loginForm.password" prefix-icon="naf-icons naf-icon-password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" :style="{width: '100%'}">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import config from '@/config';

const { productName, description } = config;

const { mapState, mapActions } = createNamespacedHelpers('login');

// import {login, getAdminInfo} from '@/api/getData'
// import {mapActions, mapState} from 'vuex'
export default {
  layout: 'footed',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      showLogin: false,
      productName,
      description
    };
  },
  async fetch({ store }) {
    // 加载字典数据
    await store.dispatch('naf/dict/load', 'unit');
  },
  mounted() {
    this.showLogin = true;
    // if (!this.adminInfo.id) {
    // this.getAdminData()
    // }
  },
  computed: {
    ...mapState(['unit'])
  },
  methods: {
    ...mapActions(['login']),
    async submitForm(formName) {
      // this.login({username:'admin',password:'pass'})
      // this.$message({
      //   type: "success",
      //   message: "登录成功"
      // });
      if (!this.unit) {
        this.$notify.error({
          title: '错误',
          message: '请选择所在单位',
          offset: 100
        });
        return;
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await this.login({
            username: this.loginForm.username || 'admin',
            password: this.loginForm.password
          });
          // console.log(res);
          if (res.errcode === 0) {
            this.$message({
              type: 'success',
              message: '登录成功',
              duration: 1000
            });
            this.$router.push(this.$route.query.redirect || '/');
          } else {
            this.$message({
              type: 'error',
              message: res.errmsg || '登录失败',
              duration: 1000
            });
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的用户名密码',
            offset: 100
          });
          return false;
        }
        return true;
      });
    }
  }
  // watch: {
  // 	adminInfo: function (newValue){
  // 		if (newValue.id) {
  // 			this.$message({
  //                     type: 'success',
  //                     message: '检测到您之前登录过，将自动登录'
  //                 });
  // 			this.$router.push('manage')
  // 		}
  // 	}
  // }
};
</script>

<style lang="less" scoped>
@import '../style/theme';

.container {
  background: #f0f2f5;
  background-image: url('~assets/bg.svg');
  width: 100%;
  min-height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  padding: 110px 0 144px 0;
  position: relative;
}
.main {
  width: 368px;
  margin: 0 auto;
}
.top {
  text-align: center;
}

.header {
  height: 44px;
  line-height: 44px;
  a {
    text-decoration: none;
  }
}

.logo {
  height: 44px;
  vertical-align: top;
  margin-right: 16px;
}

.title {
  font-size: 33px;
  color: @heading-color;
  font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-weight: 600;
  position: relative;
  top: 2px;
}

.desc {
  font-size: @font-size-base;
  color: @text-color-secondary;
  margin-top: 12px;
  margin-bottom: 40px;
}
</style>