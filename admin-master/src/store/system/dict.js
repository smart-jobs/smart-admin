import * as types from './.dict.js';
import config from '@/utils/config.js';
const { pageSize = 10 } = config;

const api = {
  createCatg: '/system/dict/category/create',
  updateCatg: '/system/dict/category/update',
  deleteCatg: '/system/dict/category/delete',
  listCatg: '/system/dict/category/list',
  createItem: (catg) => `/system/dict/items/${catg}/create`,
  updateItem: (catg) => `/system/dict/items/${catg}/update`,
  deleteItem: (catg) => `/system/dict/items/${catg}/delete`,
  listItem: (catg) => `/system/dict/items/${catg}/list`,
}

// initial state
export const state = () => ({
  categories: [], // 字典分类
  items: [], // 字典项
  category: null, // 当前字典分类
  total: 0, // 字典项总数
});

// actions
export const actions = {
  async loadCatg({ commit }, payload = {}) {
    const res = await this.$axios.$get(`${api.listCatg}`)
    if(res.errcode === 0) {
      console.log(res);
      commit(types.CATG_LOADED, res.data);
    }
    return res;
  },
  async createCatg({ commit, state }, payload) {
    const { code, name, key } = payload;
    const res = await this.$axios.$post(`${api.createCatg}`, { code, name, key });
    if(res.errcode === 0) {
      commit(types.CATG_CREATED, res.data);
    }
    return res;
  },
  async deleteCatg({ commit, state }, { code }) {
    const res = await this.$axios.$get(`${api.deleteCatg}?code=${code}`);
    if(res.errcode === 0)
      commit(types.CATG_DELETED, { code });
    return res;
  },
  async updateCatg({ commit, state }, payload = {}) {
    const { code, name, key, order } = payload;
    const res = await this.$axios.$post(`${api.updateCatg}?code=${code}`, { name, key, order });
    if(res.errcode === 0)
      commit(types.CATG_UPDATED, res.data);
    return res;
  },
  async loadItem({ state, commit }, payload = {}) {
    let { category, page = 1, size = pageSize } = payload;
    if(!category) category = state.category.code;
    const skip = Math.max(0, (page-1)*size);
    const res = await this.$axios.$get(`${api.listItem(category)}?skip=${skip}&limit=${size}`)
    if(res.errcode === 0) {
      commit(types.ITEM_LOADED, res);
    }
    return res;
  },
  async createItem({ commit, state }, payload) {
    const { category, code, name, group, status } = payload;
    const res = await this.$axios.$post(`${api.createItem(category)}`, { code, name, group, status });
    if(res.errcode === 0) {
      commit(types.ITEM_CREATED, res.data);
    }
    return res;
  },
  async deleteItem({ commit, state }, { category, code }) {
    const res = await this.$axios.$get(`${api.deleteItem(category)}?code=${code}`);
    if(res.errcode === 0)
      commit(types.ITEM_DELETED, { code });
    return res;
  },
  async updateItem({ commit, state }, payload = {}) {
    const { category, code, name, group, status, order } = payload;
    const res = await this.$axios.$post(`${api.updateItem(category)}?code=${code}`, { name, group, status, order });
    if(res.errcode === 0)
      commit(types.ITEM_UPDATED, res.data);
    return res;
  },
  async selectCatg({ commit, dispatch, state }, payload ) {
    commit(types.CATG_SELECTED, payload);
    await dispatch('loadItem', { category: payload.code });
  },

};

// mutations
export const mutations = {
  [types.CATG_LOADED](state, payload) {
    state.categories = payload;
  },
  [types.CATG_SELECTED](state, payload) {
    state.category = payload;
  },
  [types.CATG_CREATED](state, payload) {
    state.categories.push(payload);
  },
  [types.CATG_DELETED](state, payload) {
    const idx = state.categories.findIndex(p=>p.code === payload.code);
    state.categories.splice(idx, 1);
  },
  [types.CATG_UPDATED](state, payload) {
    const idx = state.categories.findIndex(p=>(p.code == payload.code));
    state.categories.splice(idx, 1, payload);
  },
  [types.ITEM_LOADED](state, {data, total}) {
    state.items = data;
    state.total = total;
  },
  [types.ITEM_CREATED](state, payload) {
    state.items.push(payload);
  },
  [types.ITEM_DELETED](state, payload) {
    const idx = state.items.findIndex(p=>p.code === payload.code);
    state.items.splice(idx, 1);
  },
  [types.ITEM_UPDATED](state, payload) {
    const idx = state.items.findIndex(p=>p.code === payload.code);
    state.items.splice(idx, 1, payload);
  },
};
