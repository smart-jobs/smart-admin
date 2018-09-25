import assert from 'assert';
import * as types from './.user.js';

const api = {
  create: '/system/user/create',
  update: '/system/user/update',
  delete: '/system/user/delete',
  list: '/system/user/list',
  passwd: '/system/user/passwd',
}
// initial state
// shape: [{ id, quantity }]
export const state = () => ({
  items: [], //所有数据
  current: null,
});

// actions
export const actions = {
  async load({ commit }, payload = {}) {
    const { department_id = 0, fetch_child = 1 } = payload;
    const res = await this.$axios.$get(`${api.list}?department_id=${department_id}&fetch_child=${fetch_child}`);
    if(res.errcode === 0) {
      commit(types.LOADED, res.userlist);
    }
    return res;
  },
  async create({ commit, state }, payload) {
    const res = await this.$axios.$post(`${api.create}`, payload);
    if(res.errcode === 0) {
      commit(types.CREATED, res.data);
    }
    return res;
  },
  async delete({ commit, state }, { userid }) {
    const res = await this.$axios.$get(`${api.delete}?userid=${userid}`);
    if(res.errcode === 0)
      commit(types.DELETED, { userid });
    return res;
  },
  async update({ commit, state }, payload = {}) {
    const { userid } = payload;
    const data = _.omit(payload, ['userid']);
    const res = await this.$axios.$post(`${api.update}?userid=${userid}`, data);
    if(res.errcode === 0)
      commit(types.UPDATED, res.data);
    return res;
  },
  async passwd({ commit, state }, payload = {}) {
    const { userid, newpass } = payload;
    assert(userid&&newpass);
    const res = await this.$axios.$post(`${api.passwd}?userid=${userid}`, {newpass});
    return res;
  },
};

// mutations
export const mutations = {
  [types.LOADED](state, payload) {
    state.items = payload;
  },
  [types.SELECTED](state, payload) {
    state.current = payload;
  },
  [types.CREATED](state, payload) {
    state.items.push(payload);
  },
  [types.DELETED](state, payload) {
    const idx = state.items.findIndex(p=>p.userid === payload.userid);
    state.items.splice(idx, 1);
  },
  [types.UPDATED](state, payload) {
    const idx = state.items.findIndex(p=>p.userid === payload.userid);
    state.items.splice(idx, 1, payload);
  },
};
