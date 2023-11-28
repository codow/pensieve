// ========================================================
// 文件上传用到的工具方法
// @author wangyb
// @createTime 2023-11-15
// ========================================================

import { isArray, isObject, isString } from 'lodash'

/**
 * 是否空值
 * @param {*} obj 对象/数组/字符串等
 * @returns true/false
 */
export function isBlank(obj) {
  if (obj === null || obj === undefined) {
    return true
  }
  if (isString(obj)) {
    return obj === ''
  }
  if (isArray(obj)) {
    return !obj.length
  }
  if (isObject(obj)) {
    return !Object.keys(obj).length
  }
  return false
}

/**
 * 是否非空值
 * @param {*} obj 对象/数组/字符串等
 * @returns true/false
 */
export function isNotBlank(obj) {
  return !isBlank(obj)
}

/**
 * 对数字进行四舍五入
 * @param {*} number 需要转换的数字
 * @param {*} p 精度 precision
 */
export function toFixed(number, p) {
  let n = +number
  if (isNaN(number)) {
    return n
  }
  let base = Math.pow(10, p)
  n = n * base
  n = Math.round(n)
  n = n / base
  n = n.toFixed(p)
  return +n
}

const FILE_SIZE_UNIT = ['B', 'KB', 'MB', 'GB', 'TB']

const FILE_SIZE_BASE_SYSTEM = 1024

/**
 * 计算文件大小名称
 * @param {*} size 需要计算的大小
 * @param {*} unit 大小单位，默认b，有效值b、kb、m、g、t
 */
export function calcFileSize(size, unit) {
  unit = ((unit || FILE_SIZE_UNIT[0]) + '').toUpperCase()
  // 判断当前单位
  let unitIndex = FILE_SIZE_UNIT.indexOf(unit)
  if (unitIndex === -1) {
    unit = FILE_SIZE_UNIT[0]
    unitIndex = 0
  }
  // 最大单位直接返回
  if (unitIndex === FILE_SIZE_UNIT.length - 1) {
    return size + unit
  }
  // 计算单位大小
  // let unitBaseSize = Math.pow(FILE_SIZE_BASE_SYSTEM, unitIndex)
  // 判断是否需要进位
  let currentSize = size
  let currentUnitIndex = unitIndex
  while (currentSize >= FILE_SIZE_BASE_SYSTEM) {
    currentSize = currentSize / 1024
    currentUnitIndex++
  }
  currentSize = toFixed(currentSize, 2)
  return currentSize + FILE_SIZE_UNIT[currentUnitIndex]
}
