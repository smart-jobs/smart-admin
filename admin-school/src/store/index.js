import * as types from '@/constants/mutation-types';

export const state = () => ({
})

// actions
export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    console.log('call nuxtServerInit...');
    // console.log(app.$axios);
    await dispatch('naf/menu/load');
    if (req.session && req.session.authUser){
      commit('login/' + types.USER_INFO, req.session.authUser);
      commit('login/' + types.LOGIN_SUCCESS);
    }

    // 从cookie中解析navMode
    //console.log('req.cookies', req.cookies);
    const { navMode } = req.cookies;
    if(navMode) {
      commit('naf/menu/NAV_SWITCH_MODE', navMode);
    }
  },
};

export const mutations = {
}

export const getters = {
  isAuthenticated: state => state.login.isAuthenticated,
  userinfo: state => state.login.userinfo,
  menuItems: state => state.naf.menu.items,
}