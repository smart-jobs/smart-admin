import Vue from 'vue';
import * as types from './.unit.js';

const api = {
  create: '/system/unit/create',
  update: '/system/unit/update',
  delete: '/system/unit/delete',
  list: '/system/unit/list',
}
// initial state
// shape: [{ id, quantity }]
export const state = () => ({
  units: [], //所有单位数据
  users: [], //单位默认用户
  current: null,
});

// actions
export const actions = {
  async load({ commit }) {
    const res = await this.$axios.$get(`${api.list}`)
    if(res.errcode === 0) {
      commit(types.LOADED, res.data);
    }
    return res;
  },
  async create({ commit, state }, { unitid, unitname }) {
    const res = await this.$axios.$post(`${api.create}`, { unitid, unitname });
    if(res.errcode === 0) {
      commit(types.CREATED, res.data);
    }
    return res;
  },
  async delete({ commit, state }, { unitid }) {
    const res = await this.$axios.$get(`${api.delete}?unitid=${unitid}`);
    if(res.errcode === 0)
      commit(types.DELETED, { unitid });
    return res;
  },
  async update({ commit, state }, payload = {}) {
    const { unitid, unitname } = payload;
    const res = await this.$axios.$post(`${api.update}?unitid=${unitid}`, { unitname });
    if(res.errcode === 0)
      commit(types.UPDATED, res.data);
    return res;
  },
  async selectUnit({ commit, state }, payload = {}) {
    commit(types.SELECTED, payload);
    // const { unitid, tagname } = payload;
    // const res = await this.$axios.$post(`${api.update}?unitid=${unitid}`, { tagname });
    // if(res.errcode === 0)
    //   commit(types.UPDATED, res.data);
    // return res;
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
  [types.CREATED](state, payload) {
    state.units.push(payload);
  },
  [types.DELETED](state, payload) {
    const idx = state.units.findIndex(p=>p.unitid === payload.unitid);
    state.units.splice(idx, 1);
  },
  [types.UPDATED](state, payload) {
    const idx = state.units.findIndex(p=>p.unitid === payload.unitid);
    // state.units.splice(idx, 1, payload);
    Vue.set(state.units, idx, payload);
  },
};
