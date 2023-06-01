// ========================================================
// 数学工具类
// @author wangyb
// @createTime 2023-06-01 15:33:40
// ========================================================

/**
 * 对数字进行四舍五入
 * @param {*} number 需要转换的数字
 * @param {*} p 精度 precision
 */
export function toFixed(number: number, p) {
  let n: number | string = +number;
  if (isNaN(number)) {
    return n;
  }
  let base = Math.pow(10, p);
  n = n * base;
  n = Math.round(n);
  n = n / base;
  n = n.toFixed(p);
  return +n;
}
