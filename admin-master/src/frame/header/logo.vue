<template>
  <div class="logo" :style="{width: width}">
    <router-link to="/">
      <img src="~/assets/logo1.svg" alt="logo" style="height:32px;width:32px;" />
    </router-link>
    <h1>{{shortName}}</h1>
    <el-tooltip effect="dark" :content="switchTip" placement="bottom">
    <el-switch :value="navMode" active-color="#13ce66"
                active-value="nested" inactive-value="lite" @change="switchMode">
    </el-switch>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    shortName: String,
    width: {
      type: String,
      default: '256px'
    },
    navMode: String
  },
  methods: {
    switchMode(payload) {
      this.$emit('switch-mode', payload);
    }
  },
  computed: {
    switchTip() {
      return this.navMode == 'nested' ? '切换到简单导航模式' : '切换到经典导航模式';
    }
  }
};
</script>
<style lang="less" scoped>
.logo {
  display: table;
  border-right: solid 1px #e6e6e6;
  padding: 0 16px;
  overflow: hidden;
  img,
  h1 {
    vertical-align: middle;
  }
  h1 {
    display: inline-block;
    margin: 0 0 0 12px;
  }

  .el-switch {
    vertical-align: middle;
    text-align: right;
    display: table-cell;
  }
}
</style>
