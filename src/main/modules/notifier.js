import * as types from './types'
import ElectronModule from './electronModule'
import Notice from '../notifier'

export default class Notifier extends ElectronModule {
  constructor (config) {
    super(config)
    this.notice = Notice.getInstance()
  }

  static get moduleName () {
    return types.MODULE_NAME_NOTIFY
  }

  sendNotification (name, params) {
    return this.notice.sendNotification(name, params)
  }

  registerClientEvent (name, fn) {
    return this.notice.registerClientEvent(name, fn)
  }

  registerModule (moduleName, module) {
    this.notice.registerModule(moduleName, module)
  }

  resolveModule (moduleName) {
    return this.notice.resolveModule(moduleName)
  }

  /**
   * @type {Notice}
   * @memberof Notifier
   */
  get notice () {
    return this._notice
  }

  set notice (notice) {
    this._notice = notice
  }
}
