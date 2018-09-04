<template>
  <nuxt-child />
</template>
<script>
export default {
  layout: 'nested',
  async fetch({store, $axios}) {
    store.commit('menu/NAV_MODULE_SELECTED', 'jobs');
  }
};
</script>
