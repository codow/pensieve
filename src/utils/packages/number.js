/**
 * 对数字进行四舍五入
 * @param {*} number 需要转换的数字
 * @param {*} p 精度 precision
 */
export function toFixed (number, p) {
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

/**
 * 判断是否是有效数字
 * @param {*} number 数字
 * @returns ture/false 
 */
export function isNumber (number) {
  number = +number
  return !isNaN(number)
}