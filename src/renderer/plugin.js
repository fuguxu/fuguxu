import Vue from 'vue'
import nativeApi from '../main/electron'
import * as types from '../main/config/types'
import * as modules from '../main/config/modules'
import Storage from '../main/storage'

require('smoothscroll-polyfill').polyfill()
Vue.use(nativeApi, Object.assign({debug: true, maxRetryTimes: 10, retrySleepTime: 100}, {types: types, modules: modules}))
Vue.$storage = Storage
Vue.prototype.$storage = Storage

export default [
  'vue',
  'vuex',
  'vue-router',
  'NativeApi',
  'vue-electron',
  'element-ui'
]
