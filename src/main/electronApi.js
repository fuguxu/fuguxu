'use strict'

import NativeApi from './native/nativeApi'

/**
 * Cordova Api父类，包含基本配置和基本入口方法
 * @extends NativeApi
 */
export default class electronApi extends NativeApi {
  constructor (conf) {
    conf = conf || {}
    conf.platform = 'electron'
    super(conf)
  }

  set methods (methods) {
    this._methods = methods
  }

  get methods () {
    return this._methods
  }
}
