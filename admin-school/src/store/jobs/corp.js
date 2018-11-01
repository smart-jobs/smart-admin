import Vue from 'vue';
import qs from 'qs';
import assert from 'assert';
import * as types from './.mutation.js';
import config from '@/utils/config.js';
const { pageSize = 10 } = config;

const api = {
  queryReg: '/jobs/corp/register/query',
  reviewReg: '/jobs/corp/register/review',
  fetchReg: '/jobs/corp/register/fetch',
  queryMem: '/jobs/corp/member/query',
  fetchMem: '/jobs/corp/member/fetch',
}
// initial state
export const state = () => ({
  items: [], 
  current: null,
  total: 0,
});

// actions
export const actions = {
  async queryReg({ commit }, { status, corpname, paging = {} }) {
    const { page = 1, size = pageSize } = paging;
    const skip = Math.max(0, (page-1)*size);
    const param = qs.stringify({status, skip, size});
    const res = await this.$axios.$get(`${api.queryReg}?${param}`)
    if(res.errcode === 0) {
      commit(types.LOADED, res);
    }
    return res;
  },
  async reviewReg({ commit }, { status, id }) {
    const res = await this.$axios.$post(`${api.reviewReg}?id=${id}`, { status });
    if(res.errcode === 0)
      commit(types.UPDATED, { status, id });
    return res;
  },
  async fetchReg({ commit }, { id }) {
    const res = await this.$axios.$get(`${api.fetchReg}?id=${id}`);
    if(res.errcode === 0)
      commit(types.SELECTED, res.data);
    return res;
  },
  async queryMem({ commit }, { status, corpname, paging = {} }) {
    const { page = 1, size = pageSize } = paging;
    const skip = Math.max(0, (page-1)*size);
    const param = qs.stringify({status, corpname, skip, size});
    const res = await this.$axios.$get(`${api.queryMem}?${param}`)
    if(res.errcode === 0) {
      commit(types.LOADED, res);
    }
    return res;
  },
  async fetchMem({ commit }, { id }) {
    const res = await this.$axios.$get(`${api.fetchMem}?id=${id}`);
    if(res.errcode === 0)
      commit(types.SELECTED, res.data);
    return res;
  },
};

// mutations
export const mutations = {
  [types.LOADED](state, {data, total}) {
    state.items = data;
    state.total = total;
  },
  [types.SELECTED](state, payload) {
    state.current = payload;
  },
  [types.UPDATED](state, payload) {
    const idx = state.items.findIndex(p=>p._id === payload._id);
    Vue.set(state.items, idx, payload);
  },
};
