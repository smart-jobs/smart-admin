import * as types from './.dept.js';

const api = {
  create: '/system/dept/create',
  update: '/system/dept/update',
  delete: '/system/dept/delete',
  list: '/system/dept/list',
}
// initial state
// shape: [{ id, quantity }]
export const state = () => ({
  items: [], //所有数据
  dict: {}, //组织机构树
  current: null,
});

const buildDict = (items = []) => {
  const dict = {};
  const root = items.filter(a=> !items.some(b=>b.id === a.parentid));
  const fetchChildren = (item)=> {
    if(!item.path) item.path = [item.name];
    dict[item.id.toString()] = item;
    const children = items.filter(p=> p.parentid === item.id)
                          .forEach(p=> fetchChildren({...p, parent: item, path: item.path.concat(p.name)}));
  };
  root.forEach(p=> fetchChildren(p));
  return dict;
}


// actions
export const actions = {
  async load({ commit }, payload = {}) {
    const { id = 0 } = payload;
    const res = await this.$axios.$get(`${api.list}?id=${id}&recursive=1`)
    if(res.errcode === 0) {
      commit(types.LOADED, res.data);
    }
    return res;
  },
  async create({ commit, state }, payload) {
    const { id, parentid, name, order } = payload;
    const res = await this.$axios.$post(`${api.create}`, { id, parentid, name, order });
    if(res.errcode === 0) {
      commit(types.CREATED, res.data);
    }
    return res;
  },
  async delete({ commit, state }, { id }) {
    const res = await this.$axios.$get(`${api.delete}?id=${id}`);
    if(res.errcode === 0)
      commit(types.DELETED, { id });
    return res;
  },
  async update({ commit, state }, payload = {}) {
    const { id, parentid, name, order } = payload;
    const res = await this.$axios.$post(`${api.update}?id=${id}`, { parentid, name, order });
    if(res.errcode === 0)
      commit(types.UPDATED, res.data);
    return res;
  },
};

// mutations
export const mutations = {
  [types.LOADED](state, payload) {
    state.items = payload;
    state.dict = buildDict(state.items);
  },
  [types.SELECTED](state, payload) {
    state.current = payload;
  },
  [types.CREATED](state, payload) {
    state.items.push(payload);
    state.dict = buildDict(state.items);
  },
  [types.DELETED](state, payload) {
    const idx = state.items.findIndex(p=>p.id === payload.id);
    state.items.splice(idx, 1);
    state.dict = buildDict(state.items);
  },
  [types.UPDATED](state, payload) {
    const idx = state.items.findIndex(p=>p.id === payload.id);
    state.items.splice(idx, 1, payload);
    state.dict = buildDict(state.items);
  },
};
