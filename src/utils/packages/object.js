/**
 * 对象方法
 * @author 王钰博
 * @createTime 2021-05-27 10:33:48
 */
import * as validator from './validator'

export function defineProperty (instance, key, value, options) {
  // 实例不是对象、数组或方法
  if (!validator.isArray(instance) && !validator.isObject(instance) && !validator.isFunction(instance)) return instance
  // 保存的路径不存在
  if (!key) return instance
  options = options || {}
  // 属性的描述
  const propertyDesc = {
    configurable: true, // 允许删除修改
    enumerable: true // 禁止枚举
  }
  if (validator.isFunction(options.getter)) {
    propertyDesc.getter = options.getter
  }
  if (validator.isFunction(options.setter)) {
    propertyDesc.setter = options.setter
  }
  if (!propertyDesc.getter && !propertyDesc.setter) {
    propertyDesc.value = value
    propertyDesc.writable = true
  }
  if ('configurable' in options) propertyDesc.configurable = !!options.configurable
  if ('enumerable' in options) propertyDesc.enumerable = !!options.enumerable
  if ('writable' in options) propertyDesc.writable = !!options.writable
  Object.defineProperty(instance, key, propertyDesc)
  return instance
}

/**
 * 给对象设置指定的数据，支持嵌套和数组
 * @param {Object|Array} obj 需要检索的对象或数组
 * @param {String} path 属性的路径
 * @param {*} value 数据
 */
export function setByPath (obj, path, value) {
  if (!path || !(validator.isArray(obj) || validator.isObject(obj))) return value
  // 替换数组标志
  const p = path.replace(/\[([0-9]+)\]/g, (str, $1) => {
    return '.$_$' + $1 + '$_$'
  })
  // 分割路径, 支持以,、;、.分割
  const pArray = p.split(/[,;.]/)
  let curr = obj
  const lastIndex = pArray.length - 1
  // 遍历路径
  const indexRegex = /^\$_\$[0-9]+\$_\$$/
  pArray.forEach((item, index) => {
    let temp = item
    const arrayFlag = indexRegex.test(temp)
    if (arrayFlag) {
      temp = temp.replace(/\$_\$/g, '')
    }

    if (index === lastIndex) {
      curr[temp] = value
    } else if (!validator.isArray(curr[temp]) && !validator.isObject(curr[temp])) {
      curr[temp] = indexRegex.test(pArray[index + 1]) ? [] : {}
    }
    curr = curr[temp]
  })

  return value
}

/**
 * 从对象中获取指定的数据，支持嵌套和数组
 * @param {Object|Array} obj 需要检索的对象或数组
 * @param {String} path 属性的路径
 */
export function getByPath (obj, path) {
  if (!path || !(validator.isArray(obj) || validator.isObject(obj))) return undefined
  // 替换数组标志
  const p = path.replace(/\[([0-9]+)\]/g, (str, $1) => {
    return '.$_$' + $1 + '$_$'
  })
  // 分割路径, 支持以,、;、.分割
  const pArray = p.split(/[,;.]/)
  let value
  let curr = obj
  const lastIndex = pArray.length - 1
  // 遍历路径
  const indexRegex = /^\$_\$[0-9]+\$_\$$/
  for (let index = 0; index <= lastIndex; index++) {
    let temp = pArray[index]
    const arrayFlag = indexRegex.test(temp)
    if (arrayFlag) {
      temp = temp.replace(/\$_\$/g, '')
    }

    if (index === lastIndex) {
      value = curr[temp]
    }
    curr = curr[temp]
    if (!curr) break
  }

  return value
}