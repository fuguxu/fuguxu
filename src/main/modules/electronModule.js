import BaseModel from '../native/BaseModel'
import * as modules from '../config/modules'

export default class ElectronModule extends BaseModel {
  getDataStore () {
    return this.resolveModule(modules.MODULE_DATASOTER)
  }

  resolveModule (name) {
    return this.nativeApi.notifier.resolveModule(name)
  }

  /**
   * 向主进程发送消息
   * @param {any} name
   * @param {any} params
   * @return {Promise}
   * @memberof ElectronModule
   */
  sendNotification (name, params) {
    /**
     * @type {Notifier}
     */
    const notifier = this.nativeApi.notifier
    try {
      if (notifier) {
        return notifier.sendNotification(name, params)
      }
    } catch (error) {
      console.log('Notifier is not registered.')
      return Promise.reject(error)
    }
  }
}
