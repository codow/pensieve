// ========================================================
// css相关的方法
// @author wangyb
// @createTime 2023-06-01 14:58:58
// ========================================================

import { BorderTypeEnum, ColorEnum } from "../constants";

export const getBorderRadius = function (borderRadius: Array<number>) {
  let [leftTopRadius = 0, rightTopRadius, rightBottomRadius, leftBottomRadius] =
    borderRadius;
  // 处理不同类型的配置
  if (rightTopRadius === undefined) {
    rightTopRadius = leftTopRadius;
  }
  if (rightBottomRadius === undefined && leftBottomRadius === undefined) {
    rightBottomRadius = leftTopRadius;
    leftBottomRadius = rightTopRadius;
  }
  if (leftBottomRadius === undefined) {
    leftBottomRadius = rightTopRadius;
  }
  return [leftTopRadius, rightTopRadius, rightBottomRadius, leftBottomRadius];
};

export function splitBorder(border: String = "") {
  let arr = border.split(/\s+/);
  if (arr.length < 2) {
    return null;
  }
  arr[2] = arr[2] || ColorEnum.Black;
  return arr;
}

export function toBorderOptions(border) {
  if (!border) {
    return null;
  }
  let arr = splitBorder(border);
  return (
    arr && {
      size: arr[0],
      type: arr[1] as unknown as BorderTypeEnum,
      color: arr[2],
    }
  );
}
