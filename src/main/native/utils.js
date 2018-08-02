'use strict'

import os from 'os'
import fs from 'fs'
import path from 'path'

export async function sleep (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve()
    }, timeout)
  })
}

export function singleInstance () {
  let instance
  return (newInstance) => {
    if (newInstance) {
      instance = newInstance
    }
    return instance
  }
}

export function printLog (_arguments, debug = true, level = 'log') {
  if (debug) {
    let console = window.console || {}
    let logFn = console[level] || console.log
    let args = []
    let length = _arguments.length

    if (length > 0 && typeof _arguments[0] === 'number') {
      args = _arguments
    } else {
      for (let i = 0; i < length; i++) {
        args.push(_arguments[i])
        if (i === 0 && length > 1) {
          args.push('=>')
        } else if (i < length - 1) {
          args.push(',')
        }
      }
    }

    logFn.apply(console, args)
  }
}

export function throwError (msg, name = '') {
  const e = new Error()
  e.message = msg
  if (name) {
    e.name = name
  }
  throw e
}

// 递归创建目录 异步方法
export function mkdirs (dirname, mode, callback) {
  fs.stat(dirname, function (err, stat) {
    if (err === null) {
      callback()
    } else if (err.code === 'ENOENT') {
      mkdirs(path.dirname(dirname), mode, function () {
        console.log('make directory -->', dirname)
        fs.mkdir(dirname, mode, callback)
      })
    }
  })
}

export function getUserDir () {
  return path.normalize(
    isMac()
      ? process.env.HOME
      : isWindows()
        ? process.env.USERPROFILE
        : '.')
}

export function isMac () {
  return /macintosh|mac os x|darwin/i.test(os.platform())
}

export function isWindows () {
  return /windows|win32/i.test(os.platform())
}
