import ElectronModule from './electronModule'
import * as types from './types'
/**
 * 系统通用接口
 * @extends BaseModel
 */
export default class Login extends ElectronModule {
  static get moduleName () {
    return types.MODULE_NAME_LOGIN
  }

  /**
   * 请求主线程跳到home页面
   * @return {*}
   */
  gotoHome () {
    // return sendEvent(this.config.types.GOTO_HOME)
    this.nativeApi.notifier.sendNotification(this.config.types.GOTO_HOME)
  }

  /**
   * 请求主线程登出
   * @return {*}
   */
  logout () {
    return this.disconnect().then(() => {
      return this.nativeApi.notifier.sendNotification(this.config.types.LOGOUT)
    })
  }

  /**
   * 请求主线程登录
   * @param username
   * @param password
   * @param isAutoLogin
   * @return {Promise|DataChannel}
   */
  login (username, password, isAutoLogin) {
    return this.nativeApi.dataService.mucLogin(username, password, isAutoLogin).then(result => {
      console.debug(result)
      if (result.code === 0) {
        const data = result.data
        this.downloadUserPhoto(data.userInfo.uid)

        return data
      } else {
        return {
          err: {
            msg: result.msg,
            code: result.code
          }
        }
      }
    })
  }
}
