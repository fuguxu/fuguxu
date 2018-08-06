import { ipcRenderer, remote } from 'electron'
import Notification from './notification'
import * as note from './note'

/**
 * 主进程通讯子进程模块
 * @description 在子进程引入，用于监听主进程事件和注册模块、获取其他进程模块方法与调用
 * @export
 * @class Notifier
 */
export default class Notifier {
  constructor () {
    this.moduleMap = {}
    this.notificationMap = {}

    /**
     * 注册基础通道监听事件，用于监听从基础通道回调的信息，并执行注册的回调方法
     */
    ipcRenderer.on(note.BASE_CHANNEL, (event, payload) => {
      console.log('Notification respond', payload.name)
      let name = payload.moduleName || payload.name
      let notifyId = payload.notifyId
      let notification = this.notificationMap[`${name}-${notifyId}`]
      try {
        notification && notification.resolve && notification.resolve(payload.result)
      } catch (err) {
        console.error(err)
      }
    })

    /**
     * 注册监听总线事件EVENT_BUS_CALL，调用指定注册模块方法
     */
    this.registerClientEvent(note.EVENT_BUS_CALL, (event, payload) => {
      let params = payload.params
      let module = this.moduleMap[payload.moduleName] // 寻找指定模块
      console.log(payload)

      // 若找到指定模块，执行指定方法
      module && module[params.implementation].apply(module, params.args).then(result => {
        // 发送执行结果事件EVENT_BUS_RESP
        this.send(note.EVENT_BUS_RESP, {
          ...payload,
          result
        })
      })
    })
  }

  /**
   * @static
   * @returns {Notifier}
   * @memberof Notifier
   */
  static getInstance () {
    if (!Notifier._instance) {
      Notifier._instance = new Notifier()
    }
    return Notifier._instance
  }

  /**
   * 发送事件
   * @param {String} name 事件名称
   * @param {*} payload 事件参数
   * @see ipcRenderer
   */
  send (name, payload) {
    ipcRenderer.send(name, payload)
  }

  /**
   * 发送事件，如果指定模块名称，则调用的是模块事件
   * @param {String} name 事件名称
   * @param {*} params 参数
   * @param {String} moduleName 模块名称
   */
  sendNotification (name, params, moduleName) {
    // console.log('Send notification', name)
    return new Promise(resolve => {
      let winId = remote.getCurrentWindow().id
      let notifyId = `${new Date().getTime()}-${winId}`
      let notification = new Notification(name, resolve)
      this.notificationMap[`${moduleName || name}-${notifyId}`] = notification
      this.send(note.BASE_CHANNEL, {
        name,
        notifyId,
        winId,
        moduleName,
        params
      })
    })
  }

  /**
   * 发送事件到主进程
   * @param {String} name 事件名称
   * @param {*} params 参数
   */
  sendNoteToMain (name, params) {
    console.log('sendNoteToMain', name)
    let winId = remote.getCurrentWindow().id
    let notifyId = `${new Date().getTime()}-${winId}`
    return this.send(note.BASE_CHANNEL, {
      name,
      notifyId,
      winId,
      params
    })
  }

  sendMessageToWindow (winId, channel, param) {
    this.send(note.EVENT_TO_WIN, {
      winId, channel, param
    })
  }

  /**
   * 注册监听主进程事件
   * @param {String} name 事件名称
   * @param {Function} fn 回调事件
   */
  registerClientEvent (name, fn) {
    ipcRenderer.removeAllListeners(name)
    return ipcRenderer.on(name, fn)
  }

  /**
   * 注册模块
   * @description 向主进程注册子进程模块
   * @param {String} moduleName 模块名称
   * @param {*} module 模块方法集
   */
  registerModule (moduleName, module) {
    let winId = remote.getCurrentWindow().id
    console.log(moduleName, winId, Object.keys(module))
    ipcRenderer.send(note.EVENT_REGISTER, {moduleName, winId, module: Object.keys(module)})
    this.moduleMap[moduleName] = module
  }

  /**
   * 根据模块名称获取模块方法集
   * @param {String} moduleName 模块名称
   */
  resolveModule (moduleName) {
    // 一下代码自行理解……………………
    if (!this.moduleMap[moduleName]) {
      let module = ipcRenderer.sendSync(note.EVENT_RESOLVE, moduleName)
      if (module) {
        let call = (implementation, args) => {
          return this.sendNotification(note.EVENT_BUS, {implementation, args}, moduleName)
        }
        let implementations = {}
        module.forEach(implementation => {
          implementations[implementation] = (...args) => {
            return call(implementation, args)
          }
        })
        this.moduleMap[moduleName] = implementations
      }
    }

    return this.moduleMap[moduleName]
  }

  get notificationMap () {
    return this._notificationMap
  }

  set notificationMap (notificationMap) {
    this._notificationMap = notificationMap
  }

  get channel () {
    return this._channel
  }

  set channel (channel) {
    this._channel = channel
  }

  get noListnser () {
    return this._noListnser
  }

  set noListnser (noListnser) {
    this._noListnser = noListnser
  }

  get moduleMap () {
    return this._moduleMap
  }

  set moduleMap (moduleMap) {
    this._moduleMap = moduleMap
  }
}
