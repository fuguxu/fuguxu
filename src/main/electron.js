import nativeApi from './nativeApi'
import electron from 'vue-electron'

export default {
  install (Vue, config) {
    Vue.use(electron)
    var nativeApiObj = nativeApi(config)
    Vue.$nativeApi = nativeApiObj
    Vue.prototype.$nativeApi = nativeApiObj
  }
}
