import BaseStore from './baseStore'
import path from 'path'
import {getUserDir} from '../native/utils'

const USER_DIR = process.env.NODE_ENV === 'development' ? 'TEST_MideaYunPan' : 'MideaYunPan'
const CREATE_TABLE = 'CREATE TABLE IF NOT EXISTS '
const DB_NAME = 'user.db'
const TABLES = {
  INFO: 'info',
  MESSAGE: 'message',
  SESSION: 'session',
  FILE: 'file',
  TEAM: 'team',
  ATREAD: 'atread',
  TEMP: 'temp',
  FILE_V5: 'file5',
  READ_AT_MSG: 'readatmessage'
}
const MESSAGE_FIELD = {'mid': 'TEXT PRIMARY KEY', 'app_key': 'TEXT', 'fId': 'TEXT', 'sId': 'TEXT', 'scene': 'TEXT', 'subType': 'NUMERIC', 'timestamp': 'NUMERIC', 'timestamp_u': 'NUMERIC', 'timestamp_s': 'NUMERIC', 'toId': 'TEXT', 'type': 'NUMERIC', 'hasRead': 'BOOLEAN', 'hasDownload': 'BOOLEAN', 'withdraw': 'BOOLEAN', 'origin': 'TEXT'}
const SESSION_FIELD = {'mid': 'TEXT', 'app_key': 'TEXT', 'fId': 'TEXT', 'sId': 'TEXT PRIMARY KEY', 'scene': 'TEXT', 'subType': 'NUMERIC', 'timestamp': 'NUMERIC', 'timestamp_u': 'NUMERIC', 'timestamp_s': 'NUMERIC', 'toId': 'TEXT', 'type': 'NUMERIC', 'hasRead': 'BOOLEAN', 'hasDownload': 'BOOLEAN', 'withdraw': 'BOOLEAN', 'origin': 'TEXT', 'isOnTop': 'BOOLEAN'}
const FILE_FIELD = {'taskId': 'TEXT PRIMARY KEY', 'fileName': 'TEXT', 'md5': 'TEXT', 'relateTaskId': 'TEXT', 'timestamp': 'NUMERIC'}
const FILE_FIELD_V5 = {'fileKey': 'TEXT PRIMARY KEY', 'fileName': 'TEXT', 'filePath': 'TEXT', 'md5': 'TEXT', 'fileSize': 'NUMERIC', 'timestamp': 'NUMERIC'}
// const ATREAD = ['mid', 'readIds']
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
      `${CREATE_TABLE} ${TABLES.INFO} (version INTEGER PRIMARY KEY, timestamp NUMERIC);
      ${CREATE_TABLE} ${TABLES.MESSAGE} (${this.generateFields(MESSAGE_FIELD)});
      ${CREATE_TABLE} ${TABLES.SESSION} (${this.generateFields(SESSION_FIELD)});
      ${CREATE_TABLE} ${TABLES.FILE} (${this.generateFields(FILE_FIELD)});
      ${CREATE_TABLE} ${TABLES.FILE_V5} (${this.generateFields(FILE_FIELD_V5)});
      ${CREATE_TABLE} ${TABLES.TEAM} (id INTEGER PRIMARY KEY, teamList TEXT);
      ${CREATE_TABLE} ${TABLES.ATREAD} (mid TEXT PRIMARY KEY, readIds TEXT);
      ${CREATE_TABLE} ${TABLES.TEMP} (id TEXT PRIMARY KEY, taskId TEXT, dir TEXT);
      ${CREATE_TABLE} ${TABLES.READ_AT_MSG} (id INTEGER PRIMARY KEY AUTOINCREMENT, mid TEXT, readIds TEXT);`
  
    const statements = sql.split(';').filter(s => s).map(s => this.prepare(s))
    return Promise.all(statements.map(statement => {
      const result = statement.run()
      console.debug(result)
      Promise.resolve(result)
    }))
  }

  static get version () {
    return 2
  }

  /**
   * 检测数据库版本区别，如果有区别则return true
   * @returns {Promise}
   */
  checkOldDb () {
    console.debug('检测数据库变更')
    const info = this.prepare(`SELECT MAX(version) as version FROM ${TABLES.INFO}`).get()
    console.debug(info, info.version)
    if (!info || !info.version || info.version < UserStore.version) {
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }

  /**
   * 数据库调整操作，客制
   * @returns {Promise}
   */
  transferData () {
    console.debug('进行数据库调整...')
    /**
     * @type String
     */
    const sql = this.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'session'`).get().sql
    if (sql.toLowerCase().replace(/\s/g, '') !== `CREATE TABLE ${TABLES.SESSION} (${this.generateFields(SESSION_FIELD)})`.toLowerCase().replace(/\s/g, '')) {
      console.debug('调整字段')
      try {
        this.prepare(`ALTER TABLE ${TABLES.SESSION} ADD isOnTop BOOLEAN`).run()
      } catch (err) {
        console.error(err)
      }
    }

    try {
      this.prepare(`DROP TABLE IF EXISTS ${TABLES.ATREAD}`).run()
    } catch (err) {
      console.error(err)
    }

    console.debug('更新数据库版本')
    const result = this.prepare(`INSERT INTO ${TABLES.INFO} (version, timestamp) VALUES (?,?)`).run(UserStore.version, Date.now())

    return Promise.resolve(result)
  }

  getAtRead (mid) {
    let sql = `select readIds from ${TABLES.READ_AT_MSG} WHERE mid = ? GROUP BY readIds`
    return Promise.resolve(this.prepare(sql).all(mid))
  }

  setAtRead (mid, readIds) {
    let sql = `INSERT INTO ${TABLES.READ_AT_MSG} (mid, readIds) VALUES (?,?)`
    return Promise.resolve(this.prepare(sql).run(mid, readIds))
  }

  getTemp (id) {
    console.debug('查找下载文件ID', id)
    let sql = `SELECT * FROM ${TABLES.TEMP} WHERE id = ?`
    return Promise.resolve(this.prepare(sql).get(id))
  }

  setTemp (data) {
    console.debug('记录下载文件信息')
    let sql = `INSERT OR REPLACE INTO ${TABLES.TEMP} VALUES(@id, @taskId, @dir)`
    return Promise.resolve(this.prepare(sql).run(data))
  }

  deleteTemp (id) {
    console.debug('删除已下载的文件信息', id)
    let sql = `DELETE FROM ${TABLES.TEMP} WHERE id = ?`
    return Promise.resolve(this.prepare(sql).run(id))
  }

  appendMessage (messageList, onlyAppend) {
    console.debug('追加消息 ---> ', messageList)
    let sIdList = {}
    let sql = `INSERT OR REPLACE INTO ${TABLES.MESSAGE} (${Object.keys(MESSAGE_FIELD)})
      VALUES (@mid,@app_key,@fId,@sId,@scene,@subType,@timestamp,@timestamp_u,@timestamp_s,@toId,@type,
        (SELECT hasRead FROM ${TABLES.MESSAGE} WHERE mid = @mid),
        (SELECT hasDownload FROM ${TABLES.MESSAGE} WHERE mid = @mid),
        (SELECT withdraw FROM ${TABLES.MESSAGE} WHERE mid = @mid),
        ?)`
    messageList.forEach((item, index) => {
      if (item.mid) {
        // sql += `${index && ',' || ''}('${item.mid}','${item.app_key}','${item.fId}','${item.sId}','${item.scene}',${item.subType},${item.timestamp || 0}, ${item.timestamp_u || 0}, ${item.timestamp_s || 0},'${item.toId}',${item.type},${Number(item.hasRead || false)},${Number(item.hasDownload || false)},${Number(item.withdraw || false)},'${JSON.stringify(item)}')`
        item = this.parseField(item, MESSAGE_FIELD)
        this.prepare(sql).run(item, JSON.stringify(item))
        if (!onlyAppend) {
          if (!sIdList[item.sId]) {
            sIdList[item.sId] = {...item}
          } else if (item.timestamp > sIdList[item.sId].timestamp) {
            sIdList[item.sId] = {...item}
          }
        }
      }
    })
    for (let sId in sIdList) {
      this.updateSession(sIdList[sId]).then(result => {
        console.debug('完成更新会话', result)
      })
    }
    return Promise.resolve(1)
  }

  updateSendMessageStatus (message) {
    console.debug('更新发送消息状态 ---> ', message)
    let sql = `UPDATE ${TABLES.MESSAGE} SET mid = @mid, timestamp = @timestamp, timestamp_u = @timestamp_u, origin = ? WHERE timestamp_s = @timestamp_s`
    return Promise.resolve(this.prepare(sql).run(message, JSON.stringify(message)))
  }

  updateMessageHasRead (message) {
    console.debug('更新消息状态 ---> ', message.body.mids, message.body.sids)
    let mids = message.body.mids || [0]
    let sids = message.body.sids || [0]
    let sql = `UPDATE ${TABLES.MESSAGE} SET hasRead = 1 WHERE mid IN (${mids.map(s => `'${s}'`).join()}) OR sId IN (${sids.map(s => `'${s}'`).join()})`
    return Promise.resolve(this.prepare(sql).run())
  }

  updateMessageHasDownload (message) {
    console.debug('更新文件消息已下载 ---> ', message)
    let sql = `UPDATE ${TABLES.MESSAGE} SET hasDownload = 1 WHERE mid = ?`
    return Promise.resolve(this.prepare(sql).run(message.body.mid))
  }

  updateMessageWithdraw (mids) {
    console.debug('更新消息撤回状态 ---> ', mids)
    let sql1 = `UPDATE ${TABLES.MESSAGE} SET withdraw = 1 WHERE mid IN (${mids.map(s => `'${s}'`).join()})`
    let sql2 = `UPDATE ${TABLES.SESSION} SET withdraw = 1 WHERE mid IN (${mids.map(s => `'${s}'`).join()})`
    return Promise.all([Promise.resolve(this.prepare(sql1).run()), Promise.resolve(this.prepare(sql2).run())])
  }

  deleteMessageHasDownload (message) {
    console.debug('更新文件消息未下载 ---> ', message)
    let sql = `UPDATE ${TABLES.MESSAGE} SET hasDownload = 0 WHERE mid = ?`
    return Promise.resolve(this.prepare(sql).run(message.mid))
  }

  deleteMessage (mids) {
    if (mids instanceof Object && !mids.length) {
      mids = [mids]
    }
    console.debug('删除消息 _id ---> ', mids)
    let sql1 = `DELETE FROM ${TABLES.MESSAGE} WHERE mid IN ${mids.join()}`
    // let sql2 = `DELETE FROM ${TABLES.SESSION} WHERE mid IN ${mids.join()}`
    // return Promise.all(Promise.resolve(this.prepare(sql1).run()), Promise.resolve(this.prepare(sql2).run()))
    return Promise.resolve(this.prepare(sql1).run())
  }

  updateSession (message) {
    console.debug('更新会话表', message.sId, message)
    let sql = `INSERT OR REPLACE INTO ${TABLES.SESSION}(${Object.keys(SESSION_FIELD)}) VALUES(@mid,@app_key,@fId,@sId,@scene,@subType,@timestamp,@timestamp_u,@timestamp_s,@toId,@type,@hasRead,@hasDownload,@withdraw,?,@isOnTop)`
    message = this.parseField(message, SESSION_FIELD)
    console.debug('updateSession', message)
    return Promise.resolve(this.prepare(sql).run(message, JSON.stringify(message)))
  }

  removeSession (sId) {
    console.debug('删除会话', sId)
    let sql = `DELETE FROM ${TABLES.SESSION} WHERE sId = ?`
    return Promise.resolve(this.prepare(sql).run(sId))
  }

  setSessionTop (sId, isOnTop = true) {
    console.debug('设置会话置顶, %s on top = %s', sId, isOnTop)
    let sql = `UPDATE ${TABLES.SESSION} SET isOnTop = ? WHERE sId = ?`
    return Promise.resolve(this.prepare(sql).run(+isOnTop, sId))
  }

  getSessionList (userId) {
    console.debug('获取会话列表', userId)
    // let sql = `SELECT origin, unreadlist.unreadMidList FROM ${TABLES.SESSION} LEFT JOIN (SELECT sId, COUNT(*) AS unreadMidList FROM ${TABLES.MESSAGE} WHERE hasRead = 0 AND fId != ? GROUP BY sId) AS unreadlist ON ${TABLES.SESSION}.sId = unreadlist.sId ORDER BY timestamp DESC`
    let sql1 = `SELECT * FROM ${TABLES.SESSION} WHERE type IN (1,2,3,7) ORDER BY timestamp DESC`
    let sql2 = `SELECT sId, mid FROM ${TABLES.MESSAGE} WHERE (hasRead = 0 OR hasRead IS NULL) AND fId != ?`

    return Promise.all([Promise.resolve(this.prepare(sql1).all()), Promise.resolve(this.prepare(sql2).all(userId))]).then(([sessions, unreadList]) => {
      sessions = sessions.map(session => Object.assign(JSON.parse(session.origin), session, {origin: 0}))
      unreadList.forEach(msg => {
        for (let session of sessions) {
          if (msg.sId === session.sId) {
            session.unreadMidList = session.unreadMidList || []
            session.unreadMidList.push(msg.mid)
            break
          }
        }
      })
      console.debug('getSessionList', unreadList, sessions)
      return sessions
    })
  }

  getMessageBySessionId ({sId, offset, pageSize}) {
    console.debug('获取消息列表', sId)
    let sql = `SELECT * FROM ${TABLES.MESSAGE} WHERE sId = ? ORDER BY timestamp DESC LIMIT ?,?`
    let rows = Promise.resolve(this.prepare(sql).all(sId, offset, pageSize)
      .map(row => Object.assign(JSON.parse(row.origin), row, {origin: 0})))
    return rows
  }

  /**
   * 保存文件信息到数据库
   * @param taskId
   * @param fileName
   * @param md5
   * @param relateTaskId
   * @return {Promise}
   */
  saveFileInfo (taskId, fileName, md5, relateTaskId) {
    console.debug('保存文件信息到数据库', taskId)
    let fields = this.parseField({taskId, fileName, md5, relateTaskId}, FILE_FIELD)
    let sql = `INSERT OR REPLACE INTO ${TABLES.FILE} (${Object.keys(FILE_FIELD).join()}) VALUES(@taskId, @fileName, @md5, @relateTaskId, ?)`
    return Promise.resolve(this.prepare(sql).run(fields, new Date().getTime()))
  }

  /**
   * 5.0保存文件信息
   * @param {{}}} fileInfo 文件信息
   */
  saveFileInfoV5 (fileInfo) {
    console.debug('V5:保存文件信息到数据库', fileInfo)
    let fields = this.parseField(fileInfo, FILE_FIELD_V5)
    fields.timestamp = Date.now()
    fields.md5 = fields.fileMd5
    let sql = `INSERT OR REPLACE INTO ${TABLES.FILE_V5} (${Object.keys(FILE_FIELD_V5).join()}) VALUES(${this.generateValue(FILE_FIELD_V5)})`
    return Promise.resolve(this.prepare(sql).run(fields))
  }
  /**
   * 5.0获取文件信息
   * @param {String} fileKey fileKey
   */
  findFileInfoV5 (fileKey) {
    console.debug('V5:查找文件信息', fileKey)
    let sql = `SELECT * FROM ${TABLES.FILE_V5} WHERE fileKey = ? OR fileKey = ?`
    const tn1 = fileKey.substring(0, fileKey.lastIndexOf('#tn1'))
    return Promise.resolve(this.prepare(sql).get(fileKey, tn1))
  }

  /**
   * 5.0删除文件信息
   * @param fileKey
   * @return {Promise}
   */
  deleteFileInfoV5 (fileKey) {
    console.debug('删除文件信息', fileKey)
    let sql = `DELETE FROM ${TABLES.FILE_V5} WHERE fileKey = ?`
    return Promise.resolve(this.prepare(sql).run(fileKey))
  }

  /**
   * 查找文件信息
   * @param taskId
   * @param thumbnail
   * @return {Promise}
   */
  findFileInfo (taskId, thumbnail) {
    console.debug('查找文件信息', taskId)
    let sql = `SELECT * FROM ${TABLES.FILE} WHERE relateTaskId = ?`
    return Promise.resolve(this.prepare(sql).get(taskId)).then(result => {
      if (!result) {
        sql = `SELECT * FROM ${TABLES.FILE} WHERE taskId = ?`
        return Promise.resolve(this.prepare(sql).get(taskId))
      }
    })
  }

  /**
   * 删除文件信息
   * @param taskId
   * @param thumbnail
   * @return {Promise}
   */
  deleteFileInfo (taskId, thumbnail) {
    console.debug('删除文件信息', taskId)
    let sql = `DELETE FROM ${TABLES.FILE} WHERE ${thumbnail && 'relateTaskId' || 'taskId'} = ?`
    return Promise.resolve(this.prepare(sql).run(taskId))
  }

  /**
   * 获取本地群组信息
   * @returns {Promise}
   * @memberof UserData
   */
  getTeamList () {
    console.debug('获取本地群组信息')
    let sql = `SELECT teamList FROM ${TABLES.TEAM} WHERE id = 1`
    return Promise.resolve(JSON.parse(this.prepare(sql).get()))
  }

  /**
   * 更新本地群组信息
   * @param {any} data
   * @returns {Promise}
   * @memberof UserData
   */
  updateTeamList (data) {
    console.debug('更新本地群组信息')
    let sql = `INSERT OR REPLACE INTO ${TABLES.TEAM} VALUES(1, ?)`
    return Promise.resolve(this.prepare(sql).run(JSON.stringify(data)))
  }
}
UserStore.DB_NAME = DB_NAME
UserStore.TABLES = TABLES
