/**
 * 字符串相关的方法
 * @author 王钰博
 * @createTime 2021-05-27 09:44:12
 */

export function uuid (retainDashed, smallLetter) {
  retainDashed = !!retainDashed
  smallLetter = !!smallLetter
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16).toUpperCase()
  })
  if (!retainDashed) {
    id = id.replace(/-/g, '')
  }
  if (smallLetter) {
    id = id.toLowerCase()
  }
  return id
}