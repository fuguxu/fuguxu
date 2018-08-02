import * as types from './types'

export default {
  [types.REG_USER] ({ commit }, user) {
    commit(types.REG_USER, user)
  },
  [types.UPDATE_USER_NAME] ({ commit }, username) {
    commit(types.UPDATE_USER_NAME, username)
  },
  [types.UPDATE_USER_PASSWORD] ({ commit }, password) {
    commit(types.UPDATE_USER_PASSWORD, password)
  },
  [types.UPDATE_USER_UID] ({ commit }, uid) {
    commit(types.UPDATE_USER_UID, uid)
  },
  [types.UPDATE_USER_REMEMBER] ({ commit, rootGetters }, rememberMe) {
    commit(types.UPDATE_USER_REMEMBER, rememberMe)
  },
  [types.UPDATE_USER_AUTO_LOGIN] ({ commit }, autoLogin) {
    commit(types.UPDATE_USER_AUTO_LOGIN, autoLogin)
  },
  [types.LOGIN] ({ commit, rootGetters }, {username, password, isAutoLogin}) {
    const autoLogin = rootGetters[types.USER].autoLogin
    const rememberMe = autoLogin || rootGetters[types.USER].rememberMe
    // TODO: 登录操作
    return rootGetters.$nativeApi.login.login(username, password, isAutoLogin).then(data => {
      if (!data.err) {
        if (!isAutoLogin) {
          rootGetters.$nativeApi.login.saveUserPassword(password).then(() => {
            rootGetters.$nativeApi.login.getUserPassword().then(data => {
              console.debug('getUserPassword', data)
            })
          })
        }
        rootGetters.$nativeApi.login.localSetting({
          autoLogin,
          rememberMe,
          username: rootGetters[types.USER].uid || '',
          password: rememberMe && (data.tokenPwdInfo && data.tokenPwdInfo.tokenPwd || rootGetters[types.USER].pwd || '')
        })
        return rootGetters.$nativeApi.login.imLogin().then(data => {
          console.debug('im login ', data)
          if (!data.err) {
            rootGetters.$nativeApi.messageService.startSync().then(result => {
              console.log('同步ok', result)
            })
          }
          return data
        })
      }

      return data
    })
  },
  [types.LOGOUT] ({ commit, rootGetters }) {
    // TODO: 登出操作
    rootGetters.$nativeApi.login.logout()
  },
  [types.ON_DISCONNECT] ({ commit, rootGetters }, fn) {
    // TODO: 连接断开监听
    rootGetters.$nativeApi.login.onDisconnect(fn)
  },
  [types.GET_LOCAL_SETTING] ({ commit, rootGetters }) {
    return rootGetters.$nativeApi.login.localSetting().then(data => {
      if (data) {
        commit(types.UPDATE_USER_UID, data.username || '')
        commit(types.UPDATE_USER_PASSWORD, data.password || '')
        commit(types.UPDATE_USER_REMEMBER, !!data.rememberMe)
        commit(types.UPDATE_USER_AUTO_LOGIN, !!data.autoLogin)
      }

      return data
    })
  },
  [types.CANCEL_LOGIN] ({ rootGetters }) {
    rootGetters.$nativeApi.login.cancel()
  }
}
