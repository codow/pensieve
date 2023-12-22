/**
 * 字符串相关的方法
 * @author 王钰博
 * @createTime 2021-05-27 09:44:12
 */

export function uuid(retainDashed, smallLetter) {
  retainDashed = !!retainDashed
  smallLetter = !!smallLetter
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16).toUpperCase()
    }
  )
  if (!retainDashed) {
    id = id.replace(/-/g, '')
  }
  if (smallLetter) {
    id = id.toLowerCase()
  }
  return id
}

/**
 * 填充字符串
 * @param {*} src
 * @param {*} length
 * @param {*} char
 * @param {*} direction
 * @return 填充后的字符串
 */
export function fillStr(src, length, char, direction) {
  src = (src || '') + ''
  length = length || src.length
  char = (char || '') + ''
  direction = direction || 'left'
  if (src.length > length) {
    return src
  }
  let isLeft = direction === 'left'
  for (let i = 0, l = length - src.length; i < l; i++) {
    if (isLeft) {
      src = char + src
    } else {
      src += char
    }
  }
  return src
}
