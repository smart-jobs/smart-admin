<template>
  <div class="banner">
    <el-menu class="nav-menu" mode="horizontal" background-color="#20a0ff" text-color="#fff" active-text-color="#ffd04b">
      <naf-menu-item v-for="(item,idx) in menuItems" :key="idx" :index="idx.toString()" :title="item.title" :options="item.options" :children="item.children" :target="item.target">
      </naf-menu-item>
    </el-menu>
    <naf-user />
  </div>
</template>
<script>
import NafMenuItem from '../menu-item';
import NafUser from './user';

export default {
  components: {
    NafMenuItem,
    NafUser
  },
  props: {
    menuItems: Array
  }
};
</script>
<style lang="less" scoped>
.banner {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
}
.nav-menu {
  flex: 1;
  border-bottom: 0;
}
</style>
