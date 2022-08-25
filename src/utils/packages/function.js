/**
 * 针对方法的一些操作
 * @author wangyb
 * @createTime 2022-08-25 14:50:43
 */
import { isFunction, isObject, isString } from './validator'

// 函数文本格式校验
const functionRegex = /^\s*function\s*/

export function isFunctionStr (obj) {
  return isString(obj) && functionRegex.test(obj)
}

/**
 * 构建函数
 * @param {*} obj 函数对象、或函数方法字符串或函数方法体
 */
export function buildFunction (obj) {
  if (isFunction(obj)) return obj
  else if (isString(obj)) {
    let func = null
    try {
      obj = obj.trim()
      if (functionRegex.test(obj)) {
        // 完整的函数，则添加返回方法，并自动执行一次
        func = eval('(' + obj + ')')
      }
    } catch (e) {
      // 不管失败的情况
    }
    return func
  }
}

/**
 * 字符串转函数
 * @param {String|Object} method 函数名或者函数体字符串或者函数配置
 * @param {Object} instance 根据函数名取函数的对象，如果是生成函数，则挂载函数到对象上
 */
export function toFunction (method, instance) {
  // 排除不合理的方法名
  if (!method) return null
  if (isFunction(method)) {
    return method
  }
  let methodName, methodHandler
  if (isObject(method)) {
    methodHandler = method.handler
  } else {
    methodHandler = method
  }
  if (isFunction(methodHandler)) {
    return methodHandler
  }
  // 根据处理方法的类型来
  if (isString(methodHandler)) {
    methodName = methodHandler
    if (instance && isFunction(instance[methodName])) {
      // 控件实例中包含对应的方法，直接使用
      methodHandler = instance[method]
    } else {
      // 将字符串转换为function对象
      methodHandler = buildFunction(method)
      // 绑定全局对象为页面对象
      if (methodHandler && instance) methodHandler = methodHandler.bind(instance)
    }
  }
  return methodHandler
}