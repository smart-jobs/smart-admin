import * as types from '@/constants/mutation-types';

export const state = () => ({
  platform: 'school',
})

// actions
export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, app }) {
    console.log('call nuxtServerInit...');
    // console.log(app.$axios);
    await dispatch('naf/menu/load');
    if (req.session && req.session.authUser){
      commit('login/' + types.USER_INFO, req.session.authUser);
      commit('login/' + types.LOGIN_SUCCESS);
      if(state.platform === 'school') {
        commit('login/' + types.SELECT_UNIT, req.session.unitcode);
      }
    }

    console.log('x-tenant:', req.header('x-tenant'));
    // console.log('headers:', req.headers);


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
  platform: state => state.platform,
  isAuthenticated: state => state.login.isAuthenticated,
  userinfo: state => state.login.userinfo,
  unitcode: state => state.login.unit,
  menuItems: state => state.naf.menu.items,
}