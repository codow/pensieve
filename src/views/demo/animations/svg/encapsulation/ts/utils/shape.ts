// ========================================================
// 图形算法
// @author wangyb
// @createTime 2023-06-01 15:58:29
// ========================================================
import { flattenDeep } from "lodash";

import { PathActionEnum } from "../constants";

interface RectAttr {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number[];
}

interface PathActionArray {
  [0]: PathActionEnum;
  [index: number]: number | String;
}
