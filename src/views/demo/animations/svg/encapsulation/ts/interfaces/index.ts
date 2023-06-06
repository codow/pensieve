// ========================================================
// 汇总支持的接口
// @author wangyb
// @createTime 2023-06-01 17:36:56
// ========================================================

import { BorderTypeEnum, PathActionEnum } from "../constants";

export interface RectAttr {
  x: number; // x坐标
  y: number; // y坐标
  width: number; // 宽度
  height: number; // 高度
  fill?: string; // 填充颜色
  border?: BorderAttr; // 边框
  borderTop?: BorderAttr; // 上边框
  borderBottom?: BorderAttr; // 下边框
  borderLeft?: BorderAttr; // 左边框
  borderRight?: BorderAttr; // 右边框
  borderRadius?: Array<number>; // 圆角
}

export interface PathActionArray
  extends Array<PathActionEnum | number | string> {
  [0]: PathActionEnum;
  [index: number]: number | string;
}

export interface BorderAttr {
  size?: number;
  type?: BorderTypeEnum;
  color?: string;
}

export interface Point {
  x: number;
  y: number;
}

export function isPoint(p: Point | PointArray): p is Point {
  return (<Point>p).x !== undefined;
}

// 至少两个值
export interface PointArray extends Array<number> {
  [0]?: number;
  [1]?: number;
  [index: number]: number;
}

export interface SideElementMap {
  [side: number]: Element;
}
