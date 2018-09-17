<template>
  <el-menu ref="menu" default-active="0" class="nav-menu" v-bind="themeStyles"
     :collapse="isCollapse" :router="false">
    <naf-menu-item v-for="(item,idx) in menuItems" :key="idx" :index="idx.toString()" :title="item.title"
      :options="item.options" :children="item.children" :target="item.target">
    </naf-menu-item>
  </el-menu>
</template>
<script>
import NafMenuItem from './menu-item';

export default {
  components: {
    NafMenuItem,
  },
  props: {
    theme: String,
    isCollapse: Boolean,
    menuItems: Array,
  },
  data() {
    return {
      msg: 'Use Vue 2.0 Today!',
      // menus,
    };
  },
  mounted: function () {
    this.$nextTick(_ => {
      // Code that will run only after the
      // entire view has been rendered
      this.$refs.menu.open('0');
    })
  },
  computed: {
    // 计算属性的 getter
    themeStyles() {
      // `this` 指向 vm 实例
      if (this.theme === 'dark') {
        // dark styles
        return {
          backgroundColor: '#545c64',
          textColor: '#fff',
          activeTextColor: '#ffd04b',
        };
      }
      // default styles
      return {
        backgroundColor: undefined,
        textColor: undefined,
        activeTextColor: undefined,
      };
    },
  },
};
</script>
<style lang="less" scoped>
</style>
