import ElectronApi from './electronApi'
import Login from './modules/login'
import Notifier from './modules/notifier'
import DataService from './modules/DataService'

export default function (config) {
  return new ElectronApi(config)
    .setModules(
      Notifier,
      DataService,
      Login
    )
}
