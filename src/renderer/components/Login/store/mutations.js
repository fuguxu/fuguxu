import * as types from './types'

export default {
  [types.REG_USER] (state, payload) {
    state[types.USER] = { ...payload }
  },
  [types.UPDATE_USER_UID] (state, uid) {
    state[types.USER].uid = uid
  },
  [types.UPDATE_USER_NAME] (state, name) {
    state[types.USER].name = name
  },
  [types.UPDATE_USER_PASSWORD] (state, pwd) {
    state[types.USER].pwd = pwd
  },
  [types.UPDATE_USER_REMEMBER] (state, flag) {
    state[types.USER].rememberMe = flag
  },
  [types.UPDATE_USER_AUTO_LOGIN] (state, flag) {
    state[types.USER].autoLogin = flag
  }
}
