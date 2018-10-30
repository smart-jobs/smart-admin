<template>
  <span>{{unitName}}</span>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState } = createNamespacedHelpers('login');

export default {
  data() {
    return {
      unitName: '',
    }
  },
  async validate({ $axios, store, params }) {
    const res = await $axios.$get(`/naf/unit/fetch?code=${params.unit}`);
    console.log(res.data);
    return res.data;
    // return /^\d{5}$/.test(params.unit);
    // return store.state.naf.dict.items.unit.some((item) => item.code === params.unit);
  },
  fetch ({ store, params }) {
    store.commit('login/SELECT_UNIT', params.unit);
  },
  mounted() {
    this.unitName = this.$dict('unit', this.unit);
  },
  computed: {
    ...mapState(['unit']),
  }
}
</script>
