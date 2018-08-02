import Datastore from 'better-sqlite3'
import path from 'path'
import { mkdirs } from '../native/utils'

export default class BaseStore {
  constructor (config) {
    this.config = config
    this.dbMap = {}
  }

  /**
   * Datastore
   * @param {any} name
   * @returns {Datastore|Promise}
   * @memberof BaseStore
   */
  async openDatastore (name) {
    console.log(`打开数据库${name}`)
    return new Promise((resolve, reject) => {
      const _this = this
      if (!this.dbMap[name]) {
        let folder = path.parse(name).dir
        console.log(folder)
        mkdirs(folder, 0o777, err => {
          if (!err) {
            _this.dbMap[name] = new Datastore(name)
            resolve(_this.dbMap[name])
          } else {
            console.error(err)
            reject(err)
          }
        })
      } else {
        resolve(this.dbMap[name])
      }
    })
  }

  async closeDatastore (name) {
    console.log(`关闭数据库${name}`)
    return Promise.resolve(this.dbMap[name] && this.dbMap[name].close())
  }

  prepare (sql) {
    try {
      console.log('Prepare statement', sql)
      return this.db.prepare(sql)
    } catch (err) {
      console.error(err)
    }
  }

  generateFields (fields) {
    return Object.keys(fields).map(field => {
      return `${field} ${fields[field]}`
    }).join()
  }

  generateValue (fields) {
    return Object.keys(fields).map(field => {
      return `@${field}`
    }).join()
  }

  /**
   * 补全字段
   * @param {{}} item 输入的原始对象
   * @returns {{}} 补全字段的对象
   * @memberof UserStore
   */
  parseField (item, fields) {
    Object.keys(fields).forEach(field => {
      switch (typeof item[field]) {
        case 'boolean':
          item[field] = item[field] && 1 || 0
          break
        default:
          item[field] = item[field] || null
      }
    })
    return item
  }

  get dbMap () {
    return this._dbMap
  }

  set dbMap (dbMap) {
    this._dbMap = dbMap
  }

  get config () {
    return this._config
  }

  set config (config) {
    this._config = config
  }

  get db () {
    return this._db
  }

  set db (db) {
    this._db = db
  }
}
