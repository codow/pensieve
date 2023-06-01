// ========================================================
// css相关的方法
// @author wangyb
// @createTime 2023-06-01 14:58:58
// ========================================================

import { BorderTypeEnum, ColorEnum } from "../constants";

export function splitBorder(border: String = "") {
  let arr = border.split(/\s+/);
  if (arr.length < 2) {
    return null;
  }
  arr[2] = arr[2] || ColorEnum.Black;
  return arr;
}

export function toBorderOptions(border: String = "") {
  let arr = splitBorder(border);
  return (
    arr && {
      size: arr[0],
      type: arr[1] as unknown as BorderTypeEnum,
      color: arr[2],
    }
  );
}
