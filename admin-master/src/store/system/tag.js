import Vue from 'vue';
import * as types from './.dept.js';

const api = {
  create: '/system/tag/create',
  update: '/system/tag/update',
  delete: '/system/tag/delete',
  list: '/system/tag/list',
  fetch: '/system/tag/fetch',
  addtagusers: '/system/tag/addtagusers',
  deltagusers: '/system/tag/deltagusers',
}
// initial state
// shape: [{ id, quantity }]
export const state = () => ({
  tags: [], //所有标签数据
  userlist: [], //当前标签用户数据
  partylist: [], //当前标签部门数据
  current: null,
});

// actions
export const actions = {
  async load({ commit }) {
    const res = await this.$axios.$get(`${api.list}`)
    if(res.errcode === 0) {
      commit(types.LOADED, res.taglist);
    }
    return res;
  },
  async create({ commit, state }, payload) {
    const { tagid, tagname } = payload;
    const res = await this.$axios.$post(`${api.create}`, { tagid, tagname });
    if(res.errcode === 0) {
      commit(types.CREATED, res.data);
    }
    return res;
  },
  async delete({ commit, state }, { tagid }) {
    const res = await this.$axios.$get(`${api.delete}?tagid=${tagid}`);
    if(res.errcode === 0)
      commit(types.DELETED, { tagid });
    return res;
  },
  async update({ commit, state }, payload = {}) {
    const { tagid, tagname } = payload;
    const res = await this.$axios.$post(`${api.update}?tagid=${tagid}`, { tagname });
    if(res.errcode === 0)
      commit(types.UPDATED, res.data);
    return res;
  },
  async selectTag({ commit, dispatch }, payload = {}) {
    commit(types.SELECTED, payload);
    await dispatch('list');
  },
  async list({ commit, state }) {
    const { tagid } = state.current;
    const res = await this.$axios.$get(`${api.fetch}?tagid=${tagid}`);
    if(res.errcode === 0) {
      commit(types.LISTED, res);
    }
    return res;
  },
  async addtagusers({ dispatch, state }, payload = {}) {
    const { tagid } = state.current;
    const res = await this.$axios.$post(`${api.addtagusers}?tagid=${tagid}`, payload);
    if(res.errcode === 0) {
      await dispatch('list');
    }
    return res;
  },
  async deltagusers({ dispatch, state }, payload = {}) {
    const { tagid } = state.current;
    const res = await this.$axios.$post(`${api.deltagusers}?tagid=${tagid}`, payload);
    if(res.errcode === 0) {
      await dispatch('list');
    }
    return res;
  },
};

// mutations
export const mutations = {
  [types.LOADED](state, payload) {
    state.tags = payload;
  },
  [types.SELECTED](state, payload) {
    state.current = payload;
  },
  [types.CREATED](state, payload) {
    state.tags.push(payload);
  },
  [types.DELETED](state, payload) {
    const idx = state.tags.findIndex(p=>p.tagid === payload.tagid);
    state.tags.splice(idx, 1);
  },
  [types.UPDATED](state, payload) {
    const idx = state.tags.findIndex(p=>p.tagid === payload.tagid);
    // state.tags.splice(idx, 1, payload);
    Vue.set(state.tags, idx, payload);
  },
  [types.LISTED](state, {userlist, partylist}) {
    state.userlist = userlist;
    state.partylist = partylist;
  },
};
