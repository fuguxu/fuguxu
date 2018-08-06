import { ipcMain } from 'electron'
import { SET_ITEM, GET_ITEM } from './types'

const Storage = {
  SET_ITEM,
  GET_ITEM,
  valueMap: {},
  setItem (key, value) {
    Storage.valueMap[key] = value
    return Storage
  },
  getItem (key) {
    return Storage.valueMap[key]
  }
}

ipcMain.on(Storage.SET_ITEM, (event, payload) => {
  console.log('Storage item set -->', payload)
  Storage.valueMap[payload.key] = payload.value
  event.returnValue = true
})

ipcMain.on(Storage.GET_ITEM, (event, { key }) => {
  console.log('Storage item get -->', key)
  event.returnValue = Storage.valueMap[key] || false
})

export default Storage
