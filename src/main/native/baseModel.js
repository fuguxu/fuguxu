'use strict'

export default class BaseModel {
  constructor (nativeApi) {
    this.nativeApi = nativeApi
  }

  static get moduleName () {
    return ''
  }

  get nativeApi () {
    return this._nativeApi
  }

  set nativeApi (nativeApi) {
    this._nativeApi = nativeApi
  }

  get config () {
    return this.nativeApi.config
  }

  get debug () {
    return this.nativeApi.debug
  }

  get platform () {
    return this.nativeApi.platform
  }

  get ready () {
    return this.nativeApi.ready
  }

  log () {
    this.nativeApi.log()
  }

  debugLog () {
    this.nativeApi.debugLog()
  }

  error () {
    this.nativeApi.error()
  }

  info () {
    this.nativeApi.info()
  }

  warn () {
    this.nativeApi.warn()
  }
}
