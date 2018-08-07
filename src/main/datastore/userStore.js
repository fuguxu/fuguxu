import BaseStore from './baseStore'
import path from 'path'
import {getUserDir} from '../native/utils'

const USER_DIR = process.env.NODE_ENV === 'development' ? 'TEST_MideaYunPan' : 'MideaYunPan'
const CREATE_TABLE = 'CREATE TABLE IF NOT EXISTS '
const DB_NAME = 'user.db'
const TABLES = {
  LOGIN_INFO: 'logininfo',
  USER_INFO: 'userinfo'
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
      `${CREATE_TABLE} ${TABLES.LOGIN_INFO} (id TEXT PRIMARY KEY, username TEXT);
      ${CREATE_TABLE} ${TABLES.USER_INFO} (username TEXT PRIMARY KEY, value TEXT, key TEXT, autologin TEXT, rebme TEXT);`
  
    const statements = sql.split(';').filter(s => s).map(s => this.prepare(s))
    return Promise.all(statements.map(statement => {
      const result = statement.run()
      console.debug(result)
      return Promise.resolve(result)
    }))
  }

  setLoginUser (username) {
    let sql = `INSERT OR REPLACE INTO ${TABLES.LOGIN_INFO} (id, username) VALUES('username',?)`
    return Promise.resolve(this.prepare(sql).run(username))
  }

  getLoginUser () {
    let sql = `select * from ${TABLES.LOGIN_INFO} WHERE id = 'username'`
    return Promise.resolve(this.prepare(sql).get())
  }

  getUserName () {
    let sql = `select username from ${TABLES.USER_INFO} GROUP BY username`
    return Promise.resolve(this.prepare(sql).all())
  }

  setUser (data) {
    let sql = `INSERT OR REPLACE INTO ${TABLES.USER_INFO} VALUES(@username, @value, @key, @autologin, @rebme)`
    return Promise.resolve(this.prepare(sql).run(data))
  }

  getUserRegs (username) {
    let sql = `select * from ${TABLES.USER_INFO} WHERE username = ?`
    return Promise.resolve(this.prepare(sql).get(username))
  }
}
UserStore.DB_NAME = DB_NAME
UserStore.TABLES = TABLES
