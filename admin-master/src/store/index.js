import * as types from './mutation-types';
const cookieParser = process.server ? require('cookie') : undefined

export const state = () => ({
  platform: 'master',
  unit: null,
})

// actions
export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, app }) {
    console.log('call nuxtServerInit...');
    console.log('x-tenant:', req.header('x-tenant'));
    commit(types.PLATFORM_INIT, req.header('x-tenant'));

    // console.log(app.$axios);
    await dispatch('naf/menu/load');
    // if (req.session && req.session.authUser){
    //   commit('login/' + types.USER_INFO, req.session.authUser);
    //   commit('login/' + types.LOGIN_SUCCESS, { userinfo: req.session.authUser, token: req.session.access_token});
    //   if(state.platform === 'school') {
    //     commit('login/' + types.SELECT_UNIT, req.session.unitcode);
    //   }
    // }

    // 从cookie中解析navMode和jwt token
    //console.log('req.cookies', req.cookies); // express使用cookie-parse中间件才能用这个
    if (req.headers.cookie && cookieParser) {
      const parsed = cookieParser.parse(req.headers.cookie)
      const { navMode, auth } = parsed;
      if(navMode) {
        commit('naf/menu/NAV_SWITCH_MODE', navMode);
      }
      if(auth) {
        commit('login/' + types.LOGIN_SUCCESS, { token: auth });
      }
    }
  },
};

export const mutations = {
  [types.PLATFORM_INIT](state, payload = 'master') {
    if(payload === 'master') {
      state.platform = 'master';
      state.unit = null;
    } else {
      state.platform = 'school';
      state.unit = payload;
    }
  },
}

export const getters = {
  platform: state => state.platform,
  isAuthenticated: state => state.login.isAuthenticated,
  userinfo: state => state.login.userinfo,
  access_token: state => state.login.access_token,
  unitcode: state => state.login.unit,
  menuItems: state => state.naf.menu.items,
}