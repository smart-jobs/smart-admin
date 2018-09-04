import * as types from '@/constants/mutation-types';

export const state = () => ({
  isAuthoriezd: false,
})

// actions
export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    console.log('call nuxtServerInit...');
    // console.log(app.$axios);
    await dispatch('menu/load');
    if (req.session && req.session.authUser){
      commit('login/' + types.USER_INFO, req.session.authUser);
      commit('login/' + types.LOGIN_SUCCESS);
    }
  },
};

export const mutations = {
}

export const getters = {
  isAuthenticated: state => state.login.isAuthenticated,
  userinfo: state => state.login.userinfo,
  menuItems: state => state.menu.items,
  menuModules: state => state.menu.modules,
  navMode: state => state.menu.mode,
}