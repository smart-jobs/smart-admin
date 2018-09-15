import * as types from './.dict.js';
import assert from 'assert';

const api = {
  listItem: (catg) => `/system/dict/code/${catg}/list`,
}

// initial state
export const state = () => ({
  categories: [], // 字典分类
  items: {// 分项映射表
    status: [
      { code: '0', name: '正常' },
      { code: '1', name: '挂起' },
      { code: '2', name: '注销' },
    ],
    usage: [
      { code: '0', name: '正常' },
      { code: '1', name: '停用' },
    ],
  }, 
  codes: {// 代码映射表
    status: {
      '0': '正常',
      '1': '挂起',
      '2': '注销',
    },
    usage: {
      '0': '正常',
      '1': '停用',
    },
  }, 
});

// actions
export const actions = {
  async load({ state, commit }, payload) {
    assert(payload);

    if(state.items[payload]){
      return {errcode: 0, errmsg: 'loaded'};
    }
    const res = await this.$axios.$get(`${api.listItem(payload)}`)
    if (res.errcode === 0) {
      commit(types.LOADED, { category: payload, items: res.data });
    }
    return res;
  },

};

// mutations
export const mutations = {
  [types.LOADED](state, { category, items }) {
    state.items[category] = items;
    state.datas[category] = items.reduce((acc, item)=>{
      acc[item.code] = item.name;
      return acc;
    }, {});
  },
};
