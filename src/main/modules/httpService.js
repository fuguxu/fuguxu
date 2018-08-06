import BaseModel from '../native/baseModel'
import { base } from '../httpRequest'
import * as types from './types'
/**
 * 系统通用接口
 * @extends BaseModel
 */
export default class HttpService extends base(BaseModel) {
  constructor (config) {
    super(config)
    this.service = config
  }

  static get moduleName () {
    return types.MODULE_NAME_HTTP_SERVICE
  }
}
