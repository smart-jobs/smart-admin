import Vue from 'vue';
import assert from 'assert';
import * as types from './.corp.js';

const api = {
  queryReg: '/jobs/corp/register/query',
  reviewReg: '/jobs/corp/register/review',
  fetchReg: '/jobs/corp/register/fetch',
}
// initial state
export const state = () => ({
  items: [], 
  current: null,
});

// actions
export const actions = {
  async queryReg({ commit }, { status, corpname }) {
    const res = await this.$axios.$get(`${api.queryReg}`)
    if(res.errcode === 0) {
      commit(types.LOADED, res.data);
    }
    return res;
  },
  async reviewReg({ commit }, { status, id }) {
    const res = await this.$axios.$post(`${api.reviewReg}?id=${id}`, { status });
    if(res.errcode === 0)
      commit(types.UPDATED, { status, id });
    return res;
  },
  async fetchRet({ commit }, { id }) {
    const res = await this.$axios.$get(`${api.fetchReg}?id=${id}`);
    if(res.errcode === 0)
      commit(types.SELECTED, res.data);
    return res;
  },
};

// mutations
export const mutations = {
  [types.LOADED](state, payload) {
    state.units = payload;
  },
  [types.SELECTED](state, payload) {
    state.current = payload;
  },
  [types.UPDATED](state, payload) {
    const idx = state.items.findIndex(p=>p._id === payload._id);
    Vue.set(state.items, idx, payload);
  },
};
