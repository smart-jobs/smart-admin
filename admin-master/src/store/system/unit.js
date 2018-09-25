import Vue from 'vue';
import assert from 'assert';
import * as types from './.unit.js';

const api = {
  create: '/system/unit/create',
  update: '/system/unit/update',
  delete: '/system/unit/delete',
  list: '/system/unit/list',
  createUser: '/system/unit/create_user',
  updateUser: '/system/unit/update_user',
  deleteUser: '/system/unit/delete_user',
  listUser: '/system/unit/list_user',
  passwd: '/system/unit/passwd',
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
  async create({ commit, state }, { code, name, createUser }) {
    const res = await this.$axios.$post(`${api.create}`, { code, name, createUser });
    if(res.errcode === 0) {
      commit(types.CREATED, res.data);
    }
    return res;
  },
  async delete({ commit, state }, { code }) {
    const res = await this.$axios.$get(`${api.delete}?code=${code}`);
    if(res.errcode === 0)
      commit(types.DELETED, { code });
    return res;
  },
  async update({ commit, state }, payload = {}) {
    const { code, name } = payload;
    const res = await this.$axios.$post(`${api.update}?code=${code}`, { name });
    if(res.errcode === 0)
      commit(types.UPDATED, res.data);
    return res;
  },
  async selectUnit({ commit, dispatch }, payload = {}) {
    commit(types.SELECTED, payload);
    await dispatch('loadUser');
  },
  async loadUser({ commit, state }) {
    const { code: unitcode } = state.current;
    const res = await this.$axios.$get(`${api.listUser}?unitcode=${unitcode}`)
    if(res.errcode === 0) {
      commit(types.USER_LOADED, res.data);
    }
    return res;
  },
  async createUser({ commit, state }, payload) {
    const { code: unitcode } = state.current;
    const res = await this.$axios.$post(`${api.createUser}?unitcode=${unitcode}`, payload);
    if(res.errcode === 0) {
      commit(types.USER_CREATED, res.data);
    }
    return res;
  },
  async deleteUser({ commit, state }, { userid }) {
    const { code: unitcode } = state.current;
    const res = await this.$axios.$get(`${api.deleteUser}?unitcode=${unitcode}&userid=${userid}`);
    if(res.errcode === 0)
      commit(types.USER_DELETED, { userid });
    return res;
  },
  async updateUser({ commit, state }, payload = {}) {
    const { code: unitcode } = state.current;
    const { userid } = payload;
    const data = _.omit(payload, ['userid']);
    const res = await this.$axios.$post(`${api.updateUser}?unitcode=${unitcode}&userid=${userid}`, data);
    if(res.errcode === 0)
      commit(types.USER_UPDATED, res.data);
    return res;
  },
  async passwd({ commit, state }, payload = {}) {
    const { code: unitcode } = state.current;
    const { userid, newpass } = payload;
    assert(userid&&newpass);
    const res = await this.$axios.$post(`${api.passwd}?unitcode=${unitcode}&userid=${userid}`, {newpass});
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
  [types.CREATED](state, payload) {
    state.units.push(payload);
  },
  [types.DELETED](state, payload) {
    const idx = state.units.findIndex(p=>p.code === payload.code);
    state.units.splice(idx, 1);
    if(state.current && state.current.code === payload.code){
      state.current = null;
      state.users = [];
    }
  },
  [types.UPDATED](state, payload) {
    const idx = state.units.findIndex(p=>p.code === payload.code);
    // state.units.splice(idx, 1, payload);
    Vue.set(state.units, idx, payload);
  },
  [types.USER_LOADED](state, payload) {
    state.users = payload;
  },
  [types.USER_CREATED](state, payload) {
    state.users.push(payload);
  },
  [types.USER_DELETED](state, payload) {
    const idx = state.users.findIndex(p=>p.userid === payload.userid);
    state.users.splice(idx, 1);
  },
  [types.USER_UPDATED](state, payload) {
    const idx = state.users.findIndex(p=>p.userid === payload.userid);
    Vue.set(state.users, idx, payload);
  },
};
