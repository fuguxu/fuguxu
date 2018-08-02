import Vue from 'vue'
import nativeApi from '../main/electron'
import * as types from '../main/config/types'
import * as modules from '../main/config/modules'

require('smoothscroll-polyfill').polyfill()
Vue.use(nativeApi, Object.assign({debug: true, maxRetryTimes: 10, retrySleepTime: 100}, {types: types, modules: modules}))

export default [
  'vue',
  'vuex',
  'vue-router',
  'NativeApi',
  'vue-electron',
  'element-ui'
]
