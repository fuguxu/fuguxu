import ElectronModule from './electronModule'
import * as types from './types'

export default class DataService extends ElectronModule {
  constructor (config) {
    super(config)
    this.serverConfig = this.config.server
  }

  static get moduleName () {
    return types.MODULE_NAME_MESSAGE_SERVICE
  }

  getAtRead (mid) {
    return this.getDataStore().getAtRead(mid)
  }

  setAtRead (mid, readIds) {
    return this.getDataStore().setAtRead(mid, readIds)
  }

  dbinit () {
    return this.getDataStore().init()
  }
}
