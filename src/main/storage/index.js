import { ipcRenderer } from 'electron'
import { SET_ITEM, GET_ITEM } from './types'

function createItem (key) {
  return (value) => {
    if (value) {
      return Storage.setItem(key, value)
    } else {
      return Storage.getItem(key)
    }
  }
}

const Storage = {
  setItem (key, value) {
    return ipcRenderer.sendSync(SET_ITEM, { key, value })
  },
  getItem (key) {
    return ipcRenderer.sendSync(GET_ITEM, { key })
  },
  token: createItem('token'),
  aesPassword: createItem('aesPassword'),
  userInfo: createItem('userInfo')
}

export default Storage
