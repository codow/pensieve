/**
 * 校验工具类
 * @author wangyb
 * @createTime 2020-07-03 09:13:08
 */

/**
 * 校验参数是否是数组
 * @param {*} obj 需要校验的参数
 */
export function isArray(obj) {
  return obj && Object.prototype.toString.apply(obj) === '[object Array]'
}

/**
 * 判断是否为空数组
 * @param {*} obj
 */
export function isEmptyArray(obj) {
  if (!isArray(obj)) return false
  return obj.length === 0
}

/**
 * 校验参数是否是对象
 * @param {*} obj 需要校验的参数
 */
export function isObject(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    Object.prototype.toString.apply(obj) === '[object Object]'
  )
}

/**
 * 判断是否为空对象
 * @param {*} obj
 */
export function isEmptyObject(obj) {
  if (!isObject(obj)) return false
  return obj.length === 0
}

/**
 * 校验参数是否是字符串
 * @param {*} obj 需要校验的参数
 */
export function isString(obj) {
  return typeof obj === 'string'
}

/**
 * 校验参数是否是函数
 * @param {*} obj 需要校验的参数
 */
export function isFunction(obj) {
  return typeof obj === 'function'
}

/**
 * 是否为空，包括空对象，空字符串，空数组，null，undefined
 * @param {*} obj
 */
export function isEmpty(obj) {
  if (obj === null || obj === undefined) return true
  if (isEmptyArray(obj)) return true
  if (isEmptyObject(obj)) return true
  return false
}

/**
 * 非空验证
 * @param {*} obj
 * @returns true/false
 */
export function isNotEmpty(obj) {
  return !isEmpty(obj)
}
