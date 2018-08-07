import ElectronModule from './electronModule'
import * as types from './types'

export default class DataService extends ElectronModule {
  constructor (config) {
    super(config)
    this.serverConfig = this.config.server
  }

  static get moduleName () {
    return types.MODULE_NAME_DATA_SERVICE
  }

  setLoginUser (username) {
    return this.getDataStore().setLoginUser(username)
  }

  getLoginUser () {
    return this.getDataStore().getLoginUser()
  }

  getUserRegs (username) {
    return this.getDataStore().getUserRegs(username)
  }

  getUserName () {
    return this.getDataStore().getUserName()
  }

  setUser (data) {
    return this.getDataStore().setUser(data)
  }

  dbinit () {
    return this.getDataStore().init()
  }
}
