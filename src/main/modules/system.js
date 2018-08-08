import os from 'os'
import * as types from './types'

/**
 * 系统通用接口
 * @extends BaseModel
 */
export default class System {
  constructor (config) {
    // super(config)
    console.debug(config)
  }

  static get moduleName () {
    return types.MODULE_NAME_SYSTEM
  }

  platform () {
    return os.platform()
  }
}
