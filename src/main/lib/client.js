import * as types from '../config/types'
import path from 'path'
import ElectronWindow from './window'
import { RendererListener } from './listener'
import { Menu, app, Tray } from 'electron'
import Notifier from '../notifier/mainNotifier'
import Storage from '../storage/Storage'
import { isWindows } from '../native/utils'

const isDebug = process.env.NODE_ENV === 'development'

export default class Client {
  constructor () {
    this.initResponder()
    Storage.setItem(app.getName(), app.getName())
  }

  /**
   * @returns {Client}
   */
  static getInstance () {
    if (!Client._instance) {
      Client._instance = new Client()
    }

    return Client._instance
  }

  initResponder () {
    RendererListener.listen()
    // DataChannelListener.listen()
    Notifier.registerNotification(types.LOGOUT, () => {
      // this.logout()
      setTimeout(() => {
        ElectronWindow.getInstance().switchLoginWindow(true)
      }, 500)
    })
    Notifier.registerNotification(types.KICKED, () => {
      ElectronWindow.getInstance().toggleWindow(false, true)
    })
  }

  initMenu () {
    console.log('设定菜单')
    const menuTemplate = [
      {
        label: app.getName() === '美的云网盘' ? '美的云网盘' : app.getName(),
        submenu: [
          {role: 'quit', label: '退出'}
        ]
      },
      {
        label: '编辑',
        role: 'edit',
        submenu: [
          {role: 'undo', label: '撤销'},
          {role: 'redo', label: '恢复'},
          {type: 'separator'},
          {role: 'cut', label: '剪切'},
          {role: 'copy', label: '复制'},
          {role: 'paste', label: '粘贴'},
          {role: 'delete', label: '删除'},
          {role: 'selectall', label: '全选'}
        ]
      },
      {
        role: 'window',
        label: '窗口',
        submenu: [
          {role: 'minimize', label: '最小化'},
          {role: 'close', label: '关闭'}
        ]
      }
    ]

    if (isDebug) {
      menuTemplate.push({
        label: '调试视图',
        submenu: [
          {role: 'reload', visible: isDebug},
          {role: 'forcereload', visible: isDebug},
          {role: 'toggledevtools', visible: isDebug}
        ]
      })
    }

    this.menuTemplate = menuTemplate
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
    console.log('设定菜单done')
    let imagePath = isDebug ? path.join(__dirname, '../../icons', 'trayTemplate.png') : path.join(app.getAppPath(), '../icons', 'trayTemplate.png')
    if (isWindows()) {
      imagePath = isDebug ? path.join(__dirname, '../../icons', 'windowsTrayTemplate.png')
        : path.join(app.getAppPath(), '../icons', 'windowsTrayTemplate.png')
    }
    this.tray = new Tray(imagePath)

    if (isWindows()) {
      this.tray.setContextMenu(Menu.buildFromTemplate([
        {
          label: '退出',
          role: 'quit'
        }
      ]))
    }

    this.tray.on('click', () => {
      ElectronWindow.getInstance().focus()
    })

    // globalShortcut.register('CommandOrControl+alt+f7', () => {
    //   console.log('CommandOrControl+alt+f7 is pressed')
    //   ElectronWindow.getInstance().showDevTool()
    // })

    // globalShortcut.register('CommandOrControl+alt+a', () => {
    //   this.screenshot(() => { })
    // })
  }

  setTrayTitle (title = '') {
    this.tray && this.tray.setTitle(title)
  }

  // alert (title, content) {
  //   dialog.showErrorBox(lang.t(title), lang.t(content))
  // }

  /**
   * @type {Tray}
   */
  get tray () {
    return this._tray
  }

  set tray (tray) {
    this._tray = tray
  }

  get menuTemplate () {
    return this._menuTemplate
  }

  set menuTemplate (menuTemplate) {
    this._menuTemplate = menuTemplate
  }

  destroy () {
    // TODO: 销毁前的操作
  }
}
