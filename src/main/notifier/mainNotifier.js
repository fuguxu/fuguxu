import { ipcMain, BrowserWindow } from 'electron'
import Notification from './notification'
import * as note from './note'

/**
 * 主进程通讯主进程模块
 * @description 主进程通讯模块，用于分发事件，管理注册模块
 * @class Notifier
 */
class Notifier {
  constructor () {
    this.notificationMap = {}
    this.moduleMap = {}

    /**
     * 监听基础通道，并分发事件或调用方法
     */
    ipcMain.on(note.BASE_CHANNEL, (event, payload) => {
      let name = payload.name
      let notifyId = payload.notifyId
      let winId = payload.winId
      event.payload = payload
      if (name === note.EVENT_BUS) {
        let moduleName = payload.moduleName
        this.callModule(moduleName, payload)
      } else {
        let notification = this.notificationMap[name]
        try {
          notification.resolve && notification.resolve.call(event, result => {
            this.resolve(winId, notifyId, name, result)
            notification = null
          }, payload.params)
        } catch (err) {
          console.error(err)
        }
      }
    })

    /**
     * 监听模块注册
     */
    ipcMain.on(note.EVENT_REGISTER, (event, {moduleName, winId, module}) => {
      Notifier.registerModule(moduleName, winId, module)
    })

    /**
     * 监听获取模块
     */
    ipcMain.on(note.EVENT_RESOLVE, (event, moduleName) => {
      event.returnValue = Notifier.resolveModule(moduleName)
    })

    ipcMain.on(note.EVENT_TO_WIN, (event, { winId = 0, channel, param }) => {
      this.sendMessageToWindow(winId, channel, param)
    })
  }

  /**
   * 发送事件到指定electron创建的窗口
   * @param {Number} id BrowserWindow的Id
   * @param {String} channel 事件名称
   * @param {*} param 参数
   */
  sendMessageToWindow (id = 0, channel, param) {
    let win = BrowserWindow.fromId(parseInt(id))
    if (win) {
      try {
        return win.webContents.send(channel, param)
      } catch (err) {
        console.error(err)
      }
    }
  }

  /**
   * 回调结果
   * @param {Number} winId BrowserWindow的Id
   * @param {String} notifyId 消息id
   * @param {String} name 事件名称
   * @param {*} result 结果
   */
  resolve (winId, notifyId, name, result) {
    this.sendMessageToWindow(winId, note.BASE_CHANNEL, {
      name,
      notifyId,
      winId,
      result
    })
  }

  /**
   * 调用指定模块方法
   * @param {String} name 模块名称
   * @param {Object} payload {params: {implementation: '接口名称'}}
   */
  callModule (name, payload) {
    let module = this.moduleMap[name]
    if (module) {
      console.log(`Call module [${name}], window id [${module.id}], method [${payload.params.implementation}]`, payload)
      try {
        this.sendMessageToWindow(module.id, note.EVENT_BUS_CALL, payload)
      } catch (err) {
        console.error(err)
      }
    } else {
      throw new Error('Module is not registered')
    }
  }

  static getInstance () {
    if (!this._instance) {
      this._instance = new Notifier()
    }
    return this._instance
  }

  /**
   * 注册消息
   * @param {String} name 事件名称
   * @param {Function} resolve 回调
   */
  static registerNotification (name, resolve) {
    let notification = new Notification(name, resolve)

    Notifier.getInstance().notificationMap[name] = notification
    return notification
  }

  /**
   * 注册模块，记录到模块集
   * @param {String} name 模块名称
   * @param {Number} id BrowserWindow的Id
   * @param {[]} module 模块方法集
   */
  static registerModule (name, id, module) {
    Notifier.getInstance().moduleMap[name] = {
      id,
      module
    }
    console.log(`Register module [${name}], window id [${id}]`, module)
  }

  /**
   * 返回模块的方法集
   * @param {String} name 模块名称
   */
  static resolveModule (name) {
    let module = Notifier.getInstance().moduleMap[name]
    return module && module.module || null
  }

  get notificationMap () {
    return this._notificationMap
  }

  set notificationMap (notificationMap) {
    this._notificationMap = notificationMap
  }

  get moduleMap () {
    return this._moduleMap
  }

  set moduleMap (moduleMap) {
    this._moduleMap = moduleMap
  }
}

module.exports = {
  registerNotification: Notifier.registerNotification,
  registerModule: Notifier.registerModule,
  resolveModule: Notifier.resolveModule,
  callModule: Notifier.callModule
}
