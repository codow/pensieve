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