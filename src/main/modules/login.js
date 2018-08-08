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
    this.nativeApi.notifier.sendNotification(this.config.types.LOGOUT)
  }
}
