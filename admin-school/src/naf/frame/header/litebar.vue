<template>
  <div class="banner">
    <i class="naf-icons" :class="{'naf-icon-unfold': menuCollapse, 'naf-icon-fold': !menuCollapse,}" @click="toggleMenu"></i>
    <naf-user />
  </div>
</template>
<script>
import NafUser from './user';

export default {
  components: {
    NafUser,
  },
  props: {
    menuCollapse: Boolean
  },
  methods: {
    toggleMenu() {
      this.$emit('toggle-menu');
    },
  },
};
</script>
<style lang="less" scoped>
.banner {
  flex: 1;
  display: block;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
}
</style>