// import * as types from './.dict.js';
import { LOADED, PRESET } from './.dict.js';
import assert from 'assert';

const api = {
  listItem: (catg) => `/naf/code/${catg}/list`,
  listUnit: '/naf/unit/list',
}

// initial state
export const state = () => ({
  categories: [], // 字典分类
  items: {},// 分项映射表
  codes: {},// 代码映射表
});

// actions
export const actions = {
  async load({ state, commit }, payload) {
    assert(payload);

    if(state.items[payload]){
      return {errcode: 0, errmsg: 'loaded'};
    }

    // LOAD PRESET DICT
    if(PRESET[payload]) {
      commit(LOADED, { category: payload, items: PRESET[payload] });
      return { errcode: 0, errmsg: 'ok' };
    }

    let res;
    if(payload === 'unit') {
      // LOAD UNIT DICT
      res = await this.$axios.$get(`${api.listUnit}`)
    } else {
      // LOAD COMMONS DICT
      res = await this.$axios.$get(`${api.listItem(payload)}`)
    }

    if (res.errcode === 0) {
      commit(LOADED, { category: payload, items: res.data });
    }
    return res;
  },

};

// mutations
export const mutations = {
  [LOADED](state, { category, items }) {
    state.items[category] = items;
    state.codes[category] = items.reduce((acc, item)=>{
      acc[item.code] = item.name;
      return acc;
    }, {});
  },
};
