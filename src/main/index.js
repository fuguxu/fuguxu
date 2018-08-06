'use strict'

import { app } from 'electron'
import ElectronWindow from './lib/window'
import MainNotifier from './notifier/mainNotifier'

console.log(MainNotifier)

const win = ElectronWindow.getInstance()

const isSecondInstance = app.makeSingleInstance((cli, workDir) => {
  ElectronWindow.getInstance().focus()
})
if (isSecondInstance) {
  app.quit()
}
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

function createWindow () {
  win.initWindow()
}

app.on('ready', createWindow)

app.on('activate', () => {
  if (app.isReady()) { win.activateWindow() }
})

// app.on('window-all-closed', () => {
//   process.platform !== 'darwin' && app.quit()
// })

app.on('before-quit', () => {
  win.destroy()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
