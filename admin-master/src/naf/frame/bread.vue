<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item,index) in catalog" :key="index">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
const DeepFind = (menus, path) => {
  for(const k in menus) {
    const item = menus[k];
    if(item.options.path == path)
      return menus[k];
    if(item.children){
      const res = DeepFind(item.children, path);
      if(res) return res;
    }
  }
  return false;
}
export default {
  computed: {
    catalog() {
      // console.log(this.$route)
      // return this.$route.meta.catalog;
      const menu = DeepFind(this.menuItems, this.$route.path);
      return (menu && menu.options && menu.options.meta && menu.options.meta.catalog) || [];
    },
    menuItems() {
      return this.$store.getters.menuItems;
    },
  },
};
</script>

