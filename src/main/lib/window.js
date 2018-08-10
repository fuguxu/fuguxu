'use strict'

import { BrowserWindow } from 'electron'

const isWindows = process.platform === 'win32'
const isDebug = process.env.NODE_ENV === 'development'
const winOptions = {
  height: 320,
  width: 440,
  // // useContentSize: true,
  show: false,
  center: true,
  resizable: isDebug,
  minimizable: false,
  maximizable: false,
  fullscreenable: false,
  alwaysOnTop: !isDebug,
  frame: !isWindows,
  // transparent: false,
  darkTheme: !isWindows && true, // MAC生效
  titleBarStyle: !isWindows && 'hiddenInset',
  autoHideMenuBar: true
}
if (!isWindows) {
  winOptions.transparent = true
}

export default class ElectronWindow {
  constructor () {
    this.winURL = isDebug
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`
    this.appQuit = false
  }

  /**
   * @returns {ElectronWindow}
   */
  static getInstance () {
    if (!ElectronWindow._instance) {
      ElectronWindow._instance = new ElectronWindow()
    }

    return ElectronWindow._instance
  }

  createLoginWindow (isReLogin = false) {
    const self = this
    let logOptions = Object.assign(winOptions, {resizable: false})
    if (self.loginWindow) {
      return
    }
    let startTime = new Date().getTime()
    self.loginWindow = new BrowserWindow(logOptions)

    self.loginWindow.loadURL(self.winURL + `#/login/${isReLogin ? 1 : 0}`)

    self.loginWindow.once('ready-to-show', () => {
      console.log(`Login window ready to show, cost ${new Date().getTime() - startTime}ms`)
      self.loginWindow.show()
    })

    self.loginWindow.once('did-finish-load', () => {
      console.log(`Login window did-finish-load, cost ${new Date().getTime() - startTime}ms`)
    })

    self.loginWindow.on('closed', () => {
      self.loginWindow = null
    })

    console.log('Created login window.')
  }

  createBackgroundWindow (windowList) {
    return Promise.all(windowList.map(name => {
      return new Promise(resolve => {
        let win = new BrowserWindow({
          show: false
        })
        win.once('ready-to-show', () => {
          console.log('%s ready.', name)
          if (isDebug) {
            win.openDevTools()
          }
          resolve()
        })
        win.loadURL(isDebug
          ? `http://localhost:9080/${name}.html`
          : `file://${__dirname}/${name}.html`)
        this.bgWindows.push(win)
      })
    }))
  }

  initWindow () {
    this.appQuit = false
    this.createBackgroundWindow(['datastore']).then(() => {
      this.toggleWindow(this.isLogin)
      // this.toggleWindow(true)
    })
  }

  createMainWindow () {
    const self = this
    if (self.mainWindow) {
      self.mainWindow.show()
      return
    }
    self.mainWindow = new BrowserWindow({
      height: 740,
      width: 1200,
      minHeight: 600,
      minWidth: 800,
      show: false,
      resizable: false,
      fullscreenable: false,
      frame: !isWindows,
      titleBarStyle: !isWindows && 'default',
      autoHideMenuBar: true,
      webPreferences: {scrollBounce: true}
    })

    this.mainWindow.once('ready-to-show', () => {
      if (self.loginWindow) {
        setTimeout(() => {
          self.closeLoginWindow()
          self.mainWindow.show()
        }, 1000)
      } else {
        self.mainWindow.show()
      }
    })
    this.mainWindow.loadURL(self.winURL)

    this.appQuit = false
    this.mainWindow.on('close', event => {
      console.log('Main window close ?', this.appQuit)
      if (!this.appQuit) {
        event.preventDefault()
        self.mainWindow.hide()
      }
      this.appQuit = false
    })

    this.mainWindow.on('closed', () => {
      self.mainWindow = null
    })

    console.log('mainWindow opened')
  }

  toggleWindow (isLogin, isReLogin = false, isKeepWindow = false) {
    const self = this
    self.isLogin = isLogin
    if (isLogin) {
      self.createMainWindow()
    } else {
      if (isKeepWindow) {
        if (self.mainWindow) {
        } else if (!self.loginWindow) {
          self.closeMainWindow()
          self.createLoginWindow(isReLogin)
        }
      } else {
        self.closeMainWindow()
        self.createLoginWindow(isReLogin)
      }
    }
  }

  focus () {
    if (this.mainWindow) {
      this.mainWindow.show()
      this.mainWindow.focus()
    } else if (this.loginWindow) {
      this.loginWindow.show()
      this.loginWindow.focus()
    } else {
      this.createLoginWindow()
    }
  }

  activateWindow () {
    if (this.mainWindow) {
      this.mainWindow.restore()
      this.mainWindow.show()
    } else if (this.loginWindow) {
      this.loginWindow.show()
    } else {
      this.createLoginWindow()
    }
  }

  switchMainWindow () {
    this.toggleWindow(true)
  }

  switchLoginWindow (isReLogin = false) {
    this.toggleWindow(false, isReLogin)
  }

  closeLoginWindow () {
    this.loginWindow && this.loginWindow.close()
  }

  closeMainWindow () {
    this.appQuit = true
    this.bgWindows.forEach(win => {
      win.reload()
    })
    this.mainWindow && this.mainWindow.close()
  }

  destroy () {
    this.appQuit = true
  }

  get isLogin () {
    return this._isLogin || false
  }

  set isLogin (isLogin) {
    this._isLogin = isLogin
  }

  get bgWindows () {
    if (!this._bgWindows) {
      this._bgWindows = []
    }
    return this._bgWindows
  }
}
