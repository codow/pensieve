// ========================================================
// 汇总支持的接口
// @author wangyb
// @createTime 2023-06-01 17:36:56
// ========================================================

import { PathActionEnum } from "../constants";

export interface RectAttr {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number[];
}

export interface PathActionArray {
  [0]: PathActionEnum;
  [index: number]: number | String;
}
