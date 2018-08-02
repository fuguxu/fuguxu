'use strict'

import { printLog, singleInstance, throwError } from './utils'

let __instance = singleInstance()

export default class NativeApi {
  constructor (conf) {
    if (__instance()) return __instance()

    this.config = conf
    __instance(this)
  }

  get config () {
    return this._config || {}
  }

  set config (conf) {
    this._config = conf
  }

  get debug () {
    return this.config.debug || false
  }

  get platform () {
    return this.config.platform || 'native'
  }

  get maxRetryTimes () {
    return typeof this.config.maxRetryTimes === 'number' ? this.config.maxRetryTimes : 5
  }

  get retrySleepTime () {
    return typeof this.config.retrySleepTime === 'number' ? this.config.retrySleepTime : 100
  }

  get ready () {
    return this.config.ready || false
  }

  set ready (isReady) {
    this.config.ready = isReady
  }

  doReady (self) {
    self.ready = true
  }

  setModule (Module, name = Module.moduleName || Module.name) {
    if (!name) {
      const str = Module.toString()
      const arr1 = str.match(/class\s+(.*?)\s+[\S\s]*\{/i)
      const arr2 = str.match(/function\s+(.*?)\s*\(.*?\)[\S\s]*\{/i)
      // console.log(str)
      // console.log(arr1)
      // console.log(arr2[1])
      name = arr1 && arr1.length > 1
        ? arr1[1]
        : (
          arr2 && arr2.length > 1
            ? arr2[1]
            : ''
        )
    }
    name = name ? name.slice(0, 1).toLowerCase() + name.slice(1) : ''
    if (!name || name.length <= 3) {
      throwError('Cannot found Module Name: ' + name + '\n' + Module.toString(), 'MissedModule')
    }
    this.addModuleName(name)
    this[name] = new Module(this)
    return this
  }

  setModules () {
    const len = arguments.length
    const args = len > 0
      ? arguments
      : []
    for (let i = 0; i < len; i++) {
      this.setModule(args[i])
    }
    return this
  }

  set moduleList (moduleList) {
    this.config.moduleList = moduleList
  }

  get moduleList () {
    return this.config.moduleList || []
  }

  addModuleName (name) {
    let moduleList = this.moduleList
    moduleList.push(name)
    this.moduleList = moduleList
  }

  log () {
    printLog(arguments, this.debug, 'log')
  }

  debugLog () {
    printLog(arguments, this.debug, 'debug')
  }

  error () {
    printLog(arguments, this.debug, 'error')
  }

  info () {
    printLog(arguments, this.debug, 'info')
  }

  warn () {
    printLog(arguments, this.debug, 'warn')
  }
}
