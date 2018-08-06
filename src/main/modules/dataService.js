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

  getUserName () {
    return this.getDataStore().getUserName()
  }

  setUserName (username) {
    return this.getDataStore().setUserName(username, username)
  }

  dbinit () {
    return this.getDataStore().init()
  }
}
