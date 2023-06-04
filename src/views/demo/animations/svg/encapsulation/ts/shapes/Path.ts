// ========================================================
// 路径相关的算法
// @author wangyb
// @createTime 2023-06-02 11:27:52
// ========================================================

import { DirectionEnum, PathActionEnum } from "../constants";
import { PathActionArray, PointArray } from "../interfaces";
// import { toFixed } from "../utils/math";

const fixRadiusPoint = function (
  p: PointArray,
  radius?: number,
  radiusD: DirectionEnum = DirectionEnum.RightDown
): PointArray {
  if (!radius) {
    return p;
  }
  let result: PointArray = [p[0], p[1], p[0], p[1]];
  // 圆角对半的坐标
  // let halfRadius = Math.sqrt(Math.pow(radius, 2) / 2); // 多
  // let otherHalfRadius = radius - halfRadius; // 少
  switch (radiusD) {
    case DirectionEnum.LeftUp:
      result[0] += radius;
      result[3] -= radius;
      // result[0] = toFixed(result[0] + halfRadius, 1);
      // result[3] = toFixed(result[3] - halfRadius, 1);
      break;
    case DirectionEnum.RightDown:
      result[0] -= radius;
      result[3] += radius;
      // result[0] = toFixed(result[0] - halfRadius, 1);
      // result[3] = toFixed(result[3] + halfRadius, 1);
      break;
    case DirectionEnum.RightUp:
      result[1] += radius;
      result[2] += radius;
      // result[1] = toFixed(result[1] + halfRadius, 1);
      // result[2] = toFixed(result[2] + halfRadius, 1);
      break;
    case DirectionEnum.LeftDown:
      result[1] -= radius;
      result[2] -= radius;
      // result[1] = toFixed(result[1] - halfRadius, 1);
      // result[2] = toFixed(result[2] - halfRadius, 1);
      break;
  }
  return result;
};

export function calcPathRadiusActions(
  points: PointArray,
  radius?: number,
  radiusD?: DirectionEnum,
  beginAction: PathActionEnum = PathActionEnum.Lineto
) {
  let actions: Array<PathActionArray> = [];
  let p: PointArray = [points[0], points[1]];
  // 圆角修正
  p = fixRadiusPoint(p, radius, radiusD);
  actions.push([beginAction, p[0], p[1]]);
  // 存在圆角
  if (radius) {
    actions.push([
      PathActionEnum.EllipticalArc,
      radius,
      radius,
      0,
      "0,1",
      p[2],
      p[3],
    ]);
  }
  return actions;
}

export function calcPathActions(
  points: PointArray,
  radius?: number,
  radiusD?: DirectionEnum
) {
  let actions: Array<PathActionArray> = [];
  // 开始
  let p = [points[0], points[1]];
  actions.push([PathActionEnum.Moveto, ...p]);
  // 圆角修正
  actions = actions.concat(
    calcPathRadiusActions([points[2], points[3]], radius, radiusD)
  );
  return actions;
}

export function calcPathActionsV2(
  points: PointArray,
  radius?: Array<number>,
  enterRadiusD?: DirectionEnum,
  outerRadiusD?: DirectionEnum
) {
  let actions: Array<PathActionArray> = [];
  // 开始
  actions = actions.concat(
    calcPathRadiusActions(
      [points[0], points[1]],
      radius[0],
      enterRadiusD,
      PathActionEnum.Moveto
    )
  );
  // 圆角修正
  actions = actions.concat(
    calcPathRadiusActions([points[2], points[3]], radius[1], outerRadiusD)
  );
  return actions;
}

export function calcPathData(
  points: PointArray,
  radius?: number,
  radiusD?: DirectionEnum
) {
  return toPathData(calcPathActions(points, radius, radiusD));
}

export function toPathData(actions: Array<PathActionArray>): string {
  if (!actions) {
    return "";
  }
  return actions.map((item) => item.join(" ")).join(" ");
}
