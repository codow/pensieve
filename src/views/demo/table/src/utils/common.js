/**
 * 表格布局的内部工具类
 * @author wangyubo
 * @createTime 2020-12-14 09:35:35
 */

export function nameToNumber (colName) {
  // A-Z 1-26
  // AA-AZ 27-52
  if (!colName) {
    return -1
  }
  let number = 0
  let base = 26
  let baseChart = 65
  let tempNumber, tempBase = 1
  let colArr = colName.split('')
  colArr = colArr.reverse()
  for (let i = 0, l = colArr.length; i < l; i++) {
    tempNumber = colArr[i].charCodeAt(0) - baseChart + 1
    number = tempBase * tempNumber + number
    tempBase = tempBase * base
  }

  return number
}

export function numberToName (colNumber) {
  // 1-26 A-Z
  // 27-52 AA-AZ
  let name = ''
  colNumber = +colNumber
  if (colNumber > 0) {
    let base = 26
    let baseChart = 65
    let current = colNumber
    do {
      current = current - 1
      name = String.fromCharCode((current % base) + baseChart) + name
      current = Math.floor(current / base)
    } while (current > 0)
  } else {
    name = '-'
  }
  return name
}