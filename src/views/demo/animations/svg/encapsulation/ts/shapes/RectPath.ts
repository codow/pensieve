// ========================================================
//
// @author wangyb
// @createTime 2023-06-01 17:38:38
// ========================================================
import flattenDeep from "lodash";
import { PathActionEnum } from "../constants";
import { RectAttr, PathActionArray } from "../interfaces";
import { createSvgElement } from "./base";

export function calcRectPath({ x, y, width, height, radius }: RectAttr) {
  let actions: PathActionArray[] = [];
  let [leftTopRadius, rightTopRadius, rightBottomRadius, leftBottomRadius] =
    radius;
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
  // 左上顶点坐标
  let p = [x, y];
  // 左上圆角修正
  if (leftTopRadius) {
    p = [p[0] + leftTopRadius, p[1]];
  }
  // 开始
  actions.push([PathActionEnum.Moveto, ...p]);
  // 右上顶点坐标
  p = [x + width, y];
  // 右上圆角修正
  if (rightTopRadius) {
    p = [p[0] - rightTopRadius, p[1]];
  }
  // 上边线
  actions.push([PathActionEnum.Lineto, ...p]);
  // 加入右上圆角
  if (rightTopRadius) {
    actions.push([
      PathActionEnum.EllipticalArc,
      rightTopRadius,
      rightTopRadius,
      0,
      "0,1",
      p[0] + rightTopRadius,
      p[1] + rightTopRadius,
    ]);
  }
  // 右下角
  p = [x + width, y + height];
  // 右下圆角修正
  if (rightBottomRadius) {
    p = [p[0], p[1] - rightBottomRadius];
  }
  // 右边线
  actions.push([PathActionEnum.Lineto, ...p]);
  // 加入右下圆角
  if (rightBottomRadius) {
    actions.push([
      PathActionEnum.EllipticalArc,
      rightBottomRadius,
      rightBottomRadius,
      0,
      "0,1",
      p[0] - rightBottomRadius,
      p[1] + rightBottomRadius,
    ]);
  }
  // 左下角
  p = [x, y + height];
  // 左下圆角修正
  if (leftBottomRadius) {
    p = [p[0] + leftBottomRadius, p[1]];
  }
  // 下边线
  actions.push([PathActionEnum.Lineto, ...p]);
  // 加入左下圆角
  if (leftBottomRadius) {
    actions.push([
      PathActionEnum.EllipticalArc,
      leftBottomRadius,
      leftBottomRadius,
      0,
      "0,1",
      p[0] - leftBottomRadius,
      p[1] - leftBottomRadius,
    ]);
  }
  // 左上角
  p = [x, y];
  // 左上角修正
  if (leftTopRadius) {
    p = [p[0], p[1] + leftTopRadius];
  }
  // 左边线
  actions.push([PathActionEnum.Lineto, ...p]);
  // 加入左上圆角
  if (leftTopRadius) {
    actions.push([
      PathActionEnum.EllipticalArc,
      leftTopRadius,
      leftTopRadius,
      0,
      "0,1",
      p[0] + leftTopRadius,
      p[1] - leftTopRadius,
    ]);
  }
  // 封闭
  actions.push([PathActionEnum.Closepath]);
  return actions;
}

/**
 * 生成矩形path的数据
 * @param attr 参数
 * @returns path的d参数
 */
export function calcRectPathData(attr: RectAttr) {
  let actions = calcRectPath(attr) || [];
  return flattenDeep(actions).join(" ");
}

export const createRectPath = function (attr: RectAttr) {
  let data = calcRectPathData(attr);
  let path = createSvgElement("path");
  path.setAttribute("d", data);
  return path;
};
