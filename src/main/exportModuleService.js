import ElectronApi from './electronApi'
import Login from './modules/login'
import Notifier from './modules/notifier'
import DataService from './modules/DataService'
import HttpService from './modules/HttpService'
import System from './modules/system'

export default function (config) {
  return new ElectronApi(config)
    .setModules(
      Notifier,
      DataService,
      Login,
      HttpService,
      System
    )
}
