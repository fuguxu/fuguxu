import ElectronWindow from './window'
import * as types from '../config/types'
import Notifier from '../notifier/mainNotifier'

export class RendererListener {
  static getList () {
    return {
      [types.GOTO_HOME]: Notifier.registerNotification,
      [types.SEND_MESSAGE_TO_HOME]: Notifier.registerNotification,
      [types.SEND_MESSAGE_TO_WIN]: Notifier.registerNotification,
      [types.OPEN_WINDOW]: Notifier.registerNotification,
      [types.CLOSE_ALL_WINDOW]: Notifier.registerNotification
    }
  }

  static listen () {
    let listenList = RendererListener.getList()

    for (let key in listenList) {
      if (listenList.hasOwnProperty(key)) {
        listenList[key](key, RendererListener[key])
      }
    }
  }

  static [types.GOTO_HOME] () {
    ElectronWindow.getInstance().switchMainWindow()
    ElectronWindow.getInstance().mainWindow.webContents.send(types.CONNECT)
  }

  static [types.SEND_MESSAGE_TO_HOME] (resolve, {channel, param}) {
    ElectronWindow.getInstance().sendMessageToMainWindow(channel, param)
  }

  static [types.SEND_MESSAGE_TO_WIN] (resolve, {winId, channel, param}) {
    ElectronWindow.getInstance().sendMessageToWindow(winId, channel, param)
  }

  static [types.OPEN_WINDOW] (resolve, {id, url, options, hidden}) {
    console.log('打开新窗口', id, url, options)
    resolve(ElectronWindow.getInstance().openWindow(id, url, options, hidden))
  }

  static [types.CLOSE_ALL_WINDOW] (resolve) {
    console.log('关闭所有窗口')
    resolve(ElectronWindow.getInstance().closeAllWindow())
  }
}
