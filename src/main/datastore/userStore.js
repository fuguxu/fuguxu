import BaseStore from './baseStore'
import path from 'path'
import {getUserDir} from '../native/utils'

const USER_DIR = process.env.NODE_ENV === 'development' ? 'TEST_MideaYunPan' : 'MideaYunPan'
const CREATE_TABLE = 'CREATE TABLE IF NOT EXISTS '
const DB_NAME = 'user.db'
const TABLES = {
  USER_LIST: 'userlist'
}
export default class UserStore extends BaseStore {
  async init () {
    console.debug('初始化用户数据库')
    console.debug(getUserDir(), USER_DIR)
    const category = path.normalize(path.join(getUserDir(), USER_DIR))
    this.db = await this.openDatastore(path.resolve(category, UserStore.DB_NAME))
    // this.db.pragma('journal_mode=WAL')
    return this.initTable()
  }

  initTable () {
    let sql =
      `${CREATE_TABLE} ${TABLES.USER_LIST} (id TEXT PRIMARY KEY, username TEXT);`
  
    const statements = sql.split(';').filter(s => s).map(s => this.prepare(s))
    return Promise.all(statements.map(statement => {
      const result = statement.run()
      console.debug(result)
      return Promise.resolve(result)
    }))
  }

  getUserName () {
    let sql = `select username from ${TABLES.USER_LIST} GROUP BY username`
    return Promise.resolve(this.prepare(sql).all())
  }

  setUserName (id, username) {
    let sql = `INSERT OR REPLACE INTO ${TABLES.USER_LIST} (id, username) VALUES(?,?)`
    return Promise.resolve(this.prepare(sql).run(id, username))
  }
}
UserStore.DB_NAME = DB_NAME
UserStore.TABLES = TABLES
