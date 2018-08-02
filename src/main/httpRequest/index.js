import request from 'request'
import server from './server'
import Storage from '../storage'
import fs from 'fs'
import crypto from 'crypto'

const HttpRequest = (sub = class { }) => class extends sub {

  constructor () {
    // super()
    // this.serverConfig = (this.config || config).server
    // this.typesConfig = (this.config || config).types
  }

  /**
   * Promise化的获取数据接口 http
   * @param option
   * @return {Promise}
   */
  getData (option) {
    return new Promise((resolve, reject) => {
      console.debug(option)
      request(option, (error, response, body) => {
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
      // 401 Token过期
      if (data.errorCode === '401') {
        return this.login().then(result => {
          if (result.errorCode === '0') {
            return this.getData(option)
          }
          return result
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
    return this.getData(Object.assign(option, {
      method: 'POST',
      url: server.API_FILE_CATALOG,
      token: this.token()
    })).then(result => {
      if (result.errorCode === '200') {
        return result.result
      }
      return false
    })
  }

  /**
   * 添加文件或目录
   * @param {[type]} option [description]
   */
  addFile (option) {
    return this.getData(Object.assign(option, {
      method: 'POST',
      url: server.API_ADD_FILE,
      token: this.token()
    })).then(result => {
      if (result.errorCode === '200') {
        return result.result
      }
      return false
    })   
  }

  /**
   * 搜索文件
   * @param  {[type]} option [description]
   * @return {[type]}        [description]
   */
  searchFile (option) {
    return this.getData(Object.assign(option, {
      method: 'POST',
      url: server.API_SEARCH_FILE,
      token: this.token()
    })).then(result => {
      if (result.errorCode === '200') {
        return result.result
      }
      return false
    })   
  }

  /**
   * 获取个人文档预览链接
   * @param  {String}  filePath
   */
  viewLink (filePath) {
    return this.getData({
      method: 'POST',
      url: server.API_VIEW_LINK,
      token: this.token()
    }).then(result => {
      if (result.errorCode === '200') {
        return result.result
      }
      return false
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

  md5 (data) {
    return crypto.createHash('md5').update(data).digest('hex')
  }

  login (userAccount = Storage.userInfo().userAccount, password) {
    console.debug(isAutoLogin)
    let aesPassword, key, iv
    const stamp = Date.now()
    if (password) {
      key = this.md5(stamp).substring(8, 8 + 16)
      iv = '0102030405060708'
      aesPassword = this.encrypt(password + 'DDvc@131', key, iv)
    } else {
      aesPassword = this.aesPassword()
    }
    console.debug(aesPassword)

    return this.getData({
      method: 'POST',
      url: server.API_LOGIN,
      userAccount,
      password: aesPassword,
      stamp,
      language: 'Zh_CN'
    }).then(result => {
      if (result.errorCode === '0') {
        Storage.userInfo(result.result.userInfo)
        Storage.aesPassword(aesPassword)
        Storage.token(result.result.token)
      } 
      return result
    })
  }

  get token () {
    return Storage.token()
  }

  get aesPassword () {
    return Storage.aesPassword()
  }
}

export default HttpRequest()
export const base = HttpRequest
