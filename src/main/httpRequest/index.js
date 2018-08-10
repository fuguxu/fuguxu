import request from 'request'
import Storage from '../storage'
import crypto from 'crypto'
import * as server from './server'
import {WebServer} from './errorTypes'

const HttpRequest = (sub = class { }) => class extends sub {
  constructor (config) {
    super(config)
    this.serverConfig = config
    this.reloginCount = 0
    // this.typesConfig = (this.config || config).types
  }

  /**
   * Promise化的获取数据接口 http
   * @param option
   * @return {Promise}
   */
  getData (url, option) {
    console.log('getData---> ', option)
    return new Promise((resolve, reject) => {
      console.debug(option)
      request({
        uri: url,
        rejectUnauthorized: false,
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        body: JSON.stringify(option),
        method: 'POST'
      }, (error, response, body) => {
        console.debug('Request respond -->', error, response)
        if (!error && response.statusCode === 200) {
          try {
            const data = typeof body === 'string' ? JSON.parse(body) : body
            console.debug('Respond data -->', data)
            resolve(data)
          } catch (err) {
            console.error(err)
            reject(err)
          }
          // let data = JSON.parse(body).data
        } else {
          reject(response)
        }
      })
    }).then(data => {
      console.log('data--> ', data)
      // 401 Token过期
      if (data.errorCode === '401' && this.reloginCount < 3) {
        const account = this.getItem('userInfo').userAccount
        const psw = this.getPassword(this.getItem('value'), this.getItem('key'))
        return this.login(account, psw).then(result => {
          this.reloginCount += 1
          if (result.errorCode === '200') {
            return result
          }
          return false
        })
      }
      return data
    })
  }

  /**
   * 浏览网盘目录
   * 获取网盘当前路径目录及文件
   * @param option
   * 浏览目录（必填） String  path  根目录填”/”，其他目录： “/fileid1/fileid2/fileid3”
   * 当前页码（必填） String  index 页码从1开始
   * 每页条数（必填） String  pageSize  暂定100条
   * 浏览类型（必填） String  type  取值说明
   *                “0”：所有（包括文件和文件夹）（默认）
   *                “1”：文件夹  （移动或复制文件场景用）
   *                “2”：文件 （备用）
   * 排序字段(非必填) String  sortFiled [0:时间升序，1:文件大小，2：文件名称]
   * 排序方式(非必填) String  sortType  [1:升序，2：降序]
   * 令牌（必填）  String  token
   * @return {Promise}
   */
  fileCatalog (option) {
    const url = server.API_FILE_CATALOG
    return this.getData(url, Object.assign(option, {
      token: this.getItem('token')
    })).then(result => {
      if (result.errorCode === '200') {
        return result.result
      } else {
        this.alertError(result.errorCode)
        return false
      }
    })
  }

  /**
   * 添加文件或目录
   * @param {[type]} option [description]
   */
  addFile (option) {
    const url = server.API_ADD_FILE
    return this.getData(url, Object.assign(option, {
      token: this.getItem('token'),
      userAccount: this.getItem('userInfo').userAccount
    })).then(result => {
      if (result.errorCode === '200') {
        return result.result
      } else {
        this.alertError(result.errorCode)
        return false
      }
    })   
  }

  /**
   * 搜索文件
   * @param  {[type]} option [description]
   * @return {[type]}        [description]
   */
  searchFile (option) {
    const url = server.API_SEARCH_FILE
    return this.getData(url, Object.assign(option, {
      token: this.getItem('token')
    })).then(result => {
      if (result.errorCode === '200') {
        return result.result
      } else {
        this.alertError(result.errorCode)
        return false
      }
    })   
  }

  /**
   * 获取个人文档预览链接
   * @param  {String}  filePath
   */
  viewLink (filePath) {
    const url = server.API_VIEW_LINK
    return this.getData(url, Object.assign(filePath, {
      token: this.getItem('token')
    })).then(result => {
      if (result.errorCode === '200') {
        return result.result
      } else {
        this.alertError(result.errorCode)
        return false
      }
    })   
  }

  /**
   * 登录
   */
  encrypt (text, key, iv) {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  }

  decrypt (text, key, iv) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  }

  md5 (data) {
    return crypto.createHash('md5').update(data).digest('hex')
  }

  encryptStamp (stamp) {
    const key = '0102030405060708'
    const iv = '1122334455667788'
    return this.encrypt(stamp, key, iv)
  }

  decryptStamp (hexKey) {
    const key = '0102030405060708'
    const iv = '1122334455667788'
    return this.decrypt(hexKey, key, iv)
  }

  getPassword (pwhex, stamphex) {
    const stamp = this.decryptStamp(stamphex)
    const key = this.md5(stamp).substring(8, 8 + 16)
    const iv = '0102030405060708'
    const password = this.decrypt(pwhex, key, iv)
    return password.slice(0, -8)
  }

  alertError (errorCode) {
    let errorText
    errorText = WebServer.filter(item => item.errorCode === errorCode)
    errorText && errorText.length && alert(errorText[0].desc)
  }

  login (userAccount, password) {
    let aesPassword, key, iv, data
    const url = server.API_LOGIN
    const stamp = Date.now().toString()
    const encryptStamp = this.encryptStamp(stamp)

    key = this.md5(stamp).substring(8, 8 + 16)
    iv = '0102030405060708'
    aesPassword = this.encrypt(password + 'DDvc@131', key, iv)

    return this.getData(url, {
      userAccount,
      password: aesPassword,
      stamp,
      language: 'Zh_CN'
    }).then(result => {
      if (result.errorCode === '200') {
        data = result.result
        if (data) {
          Storage.setItem('userInfo', data)
          Storage.setItem('token', data.token)
          Storage.setItem('value', aesPassword)
          Storage.setItem('key', encryptStamp)
        }
        result.aesPassword = aesPassword
        result.stamp = encryptStamp
        return result
      } else {
        this.alertError(result.errorCode)
        return false
      }
    })
  }

  getItem (key) {
    return Storage.getItem(key)
  }

  setItem (key, value) {
    return Storage.setItem(key, value)
  }
}

export default HttpRequest()
export const base = HttpRequest
