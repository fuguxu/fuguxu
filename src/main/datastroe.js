import UserStore from './datastore/userStore'
export default function (config) {
  const uds = new UserStore(config)
  const background = Object.assign({},
    exportMethods(uds, getAllFuncs(uds)))
  console.log(background)

  return background
}

/**
 * @param {any} Constructor
 * @returns {String[]}
 */
function getAllFuncs (Constructor) {
  var extendsProps = Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(Constructor)))
  var props = extendsProps.concat(Object.getOwnPropertyNames(Object.getPrototypeOf(Constructor)))

  return props.sort().filter(function (e, i, arr) {
    if (e !== arr[i + 1] && (typeof Constructor[e] === 'function')) return true
  })
}

function exportMethods (instance, methods) {
  let obj = {}
  for (let method of methods) {
    obj[method] = function () {
      return instance[method].apply(instance, arguments)
    }
  }

  return obj
}
