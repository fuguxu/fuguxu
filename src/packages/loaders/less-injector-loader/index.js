var loaderUtils = require('loader-utils')
var path = require('path')

module.exports = function (source) {
  var self = this
  self.cacheable && self.cacheable()
  var getOptions = loaderUtils.getOptions ? loaderUtils.getOptions : loaderUtils.parseQuery
  var options = getOptions(self) || {}
  var projectRoot = self.options.context || path.resolve(__dirname, '../../../')
  var baseDir = options.baseDir || 'renderer'
  var srcDir = options.srcDir || 'src'
  var basePath = path.normalize(self.resourcePath).replace(/\\/g, '/')
  var baseReg = new RegExp('' + baseDir + '\\/components', 'gim')
  var appReg = new RegExp('' + baseDir + '\\/App\\.vue$', 'gim')
  var ref, sharedVarRef, sharedMixinRef, sharedBasicsRef, str

  if (baseReg.test(basePath)) {
    ref = path.normalize(path.relative(basePath, path.join(projectRoot, srcDir, baseDir)))
    sharedVarRef = path.normalize(path.join(ref, baseDir, 'assets', 'styles', 'variables.less')).replace(/\\/g, '/')
    sharedMixinRef = path.normalize(path.join(ref, baseDir, 'assets', 'styles', 'mixins.less')).replace(/\\/g, '/')
    sharedBasicsRef = path.normalize(path.join(ref, baseDir, 'assets', 'styles', 'basics.less')).replace(/\\/g, '/')

    str = ''
    str += '@import \'' + sharedVarRef + '\';' + '\n'
    str += '@import \'' + sharedMixinRef + '\';' + '\n'
    str += '@import \'' + sharedBasicsRef + '\';' + '\n'

    // console.log(str)

    return str + source
  } else if (appReg.test(basePath)) {
    ref = path.normalize(path.relative(basePath, path.join(projectRoot, srcDir, baseDir)))
    sharedVarRef = path.normalize(path.join(ref, baseDir, 'assets', 'styles', 'variables.less')).replace(/\\/g, '/')
    sharedMixinRef = path.normalize(path.join(ref, baseDir, 'assets', 'styles', 'mixins.less')).replace(/\\/g, '/')
    sharedBasicsRef = path.normalize(path.join(ref, baseDir, 'assets', 'styles', 'basics.less')).replace(/\\/g, '/')

    str = ''
    str += '@import \'' + sharedVarRef + '\';' + '\n'
    str += '@import \'' + sharedMixinRef + '\';' + '\n'
    str += '@import \'' + sharedBasicsRef + '\';' + '\n'

    // console.log(str)

    return str + source
  } else {
    return source
  }
}
