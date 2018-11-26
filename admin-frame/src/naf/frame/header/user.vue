<template>
  <!--简洁用户菜单-->
  <div class="right lite">
    <span class="name">{{userinfo && userinfo.fullname || '管理員'}}</span>
    <span>|</span>
    <el-button type="text" @click="handleLogout">退出</el-button>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  props: {
    menuCollapse: Boolean
  },
  methods: {
    ...mapActions({
      logout: 'login/logout'
    }),
    async handleLogout() {
      console.log(this.userinfo);
      console.log(this);
      const res = await this.logout();
      // console.log(res);
      if (res.errcode === 0) {
        this.$router.push(this.$route.query.redirect || '/login');
      }
    }
  },
  computed: mapState({
    userinfo: state => state.login.userinfo
  })
};
</script>
<style lang="less" scoped>
.right.lite {
  font-size: 14px;
}
.el-button--text {
  color: white;
}
</style>
