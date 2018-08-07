import { ipcRenderer } from 'electron'
import { SET_ITEM, GET_ITEM } from './types'

const Storage = {
  setItem (key, value) {
    return ipcRenderer.sendSync(SET_ITEM, { key, value })
  },
  getItem (key) {
    return ipcRenderer.sendSync(GET_ITEM, { key })
  }
}

export default Storage
