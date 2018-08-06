import * as types from '../config/types'
import * as modules from '../config/modules'
import Notifier from '../notifier'
import datastore from '../datastore'

const config = {types, modules}

console.log(config, modules.MODULE_DATASOTER)

Notifier.getInstance().registerModule(modules.MODULE_DATASOTER, datastore(config))
