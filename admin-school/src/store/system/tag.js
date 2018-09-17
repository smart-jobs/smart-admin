import Vue from 'vue';
import * as types from './.dept.js';

const api = {
  create: '/system/tag/create',
  update: '/system/tag/update',
  delete: '/system/tag/delete',
  list: '/system/tag/list',
}
// initial state
// shape: [{ id, quantity }]
export const state = () => ({
  tags: [], //所有标签数据
  items: [], //所有标签用户数据
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
  async selectTag({ commit, state }, payload = {}) {
    commit(types.SELECTED, payload);
    // const { tagid, tagname } = payload;
    // const res = await this.$axios.$post(`${api.update}?tagid=${tagid}`, { tagname });
    // if(res.errcode === 0)
    //   commit(types.UPDATED, res.data);
    // return res;
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
};
