<template>
  <div class="header-box">
    <naf-logo :width="logoWidth" :shortName="shortName" :nav-mode="navMode" @switch-mode="switchMode"/>
    <naf-nav-bar v-if="navMode == 'nested'" :menu-items="menuItems" />
    <naf-lite-bar v-else :menu-collapse="menuCollapse" @toggle-menu="toggleMenu" />
  </div>
</template>
<script>
import NafLogo from './logo';
import NafLiteBar from './litebar';
import NafNavBar from './navbar';

export default {
  components: {
    NafLogo,
    NafLiteBar,
    NafNavBar,
  },
  props: {
    shortName: String,
    logoWidth: {
      type: String,
      default: '256px'
    },
    menuCollapse: Boolean,
    menuItems: Array,
    navMode: String,
  },
  methods: {
    switchMode(payload) {
      this.$emit('switch-mode', payload);
    },
    toggleMenu(payload) {
      this.$emit('toggle-menu', payload);
    }
  }
};
</script>
<style lang="less" scoped>
.header-box {
  background: #20a0ff;
  color: #fff;
  display: flex;
  flex-direction: row;
  padding: 0;
  height: 100%;
}
</style>
