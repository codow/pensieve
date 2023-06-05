// ========================================================
//
// @author wangyb
// @createTime 2023-06-01 17:38:38
// ========================================================
import {
  BorderTypeEnum,
  DirectionEnum,
  PathActionEnum,
  SideEnum,
} from "../constants";
import {
  RectAttr,
  PathActionArray,
  BorderAttr,
  PointArray,
} from "../interfaces";
import { getObjectValue } from "../utils/object";
import { calcPathActions, calcPathActionsV2, toPathData } from "./Path";
import { createSvgElement } from "./base";

const getBorderRadius = function (borderRadius: Array<number>) {
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

export function calcRectPathActions({
  x = 0,
  y = 0,
  width,
  height,
  borderRadius = [],
}: RectAttr) {
  let actions: Array<PathActionArray> = [];
  let [leftTopRadius, rightTopRadius, rightBottomRadius, leftBottomRadius] =
    getBorderRadius(borderRadius);

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
  let actions = calcRectPathActions(attr) || [];
  return actions.map((item) => item.join(" ")).join(" ");
}

export const createRectPath = function (attr: RectAttr): SVGElement {
  let data = calcRectPathData(attr);
  let path = createSvgElement("path");
  path.setAttribute("d", data);
  path.setAttribute("fill", attr.fill);
  return path;
};

export const createRectPathSideBorder = function (
  side: SideEnum,
  { x = 0, y = 0, width = 0, height = 0 }: RectAttr,
  { size = 0, type = BorderTypeEnum.Solid, color = "" }: BorderAttr,
  borderRadius = 0
): SVGElement {
  let points: PointArray = [];
  let corners: Array<PointArray> = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
  let radiusD;
  let halfSize = size / 2;
  switch (side) {
    case SideEnum.Top:
      radiusD = DirectionEnum.RightDown;
      points = [
        corners[0][0] + halfSize + borderRadius,
        corners[0][1] + halfSize,
        corners[1][0] - halfSize,
        corners[1][1] + halfSize,
      ];
      break;
    case SideEnum.Right:
      radiusD = DirectionEnum.LeftDown;
      points = [
        corners[1][0] - halfSize,
        corners[1][1] + halfSize + borderRadius,
        corners[2][0] - halfSize,
        corners[2][1] - halfSize,
      ];
      break;
    case SideEnum.Bottom:
      radiusD = DirectionEnum.LeftUp;
      points = [
        corners[2][0] - halfSize - borderRadius,
        corners[2][1] - halfSize,
        corners[3][0] + halfSize,
        corners[3][1] - halfSize,
      ];
      break;
    case SideEnum.Left:
      radiusD = DirectionEnum.RightUp;
      points = [
        corners[3][0] + halfSize,
        corners[3][1] - halfSize - borderRadius,
        corners[0][0] + halfSize,
        corners[0][1] + halfSize,
      ];
      break;
  }
  let actions = calcPathActions(points, borderRadius, radiusD);

  let path = createSvgElement("path");
  path.setAttribute("d", toPathData(actions));
  if (size) {
    path.setAttribute("stroke-width", size + "");
  }
  if (color) {
    path.setAttribute("stroke", color);
  }
  switch (type) {
    case BorderTypeEnum.DashedShort:
      path.setAttribute("stroke-dasharray", "2 2");
      break;
    case BorderTypeEnum.Dashed:
      path.setAttribute("stroke-dasharray", "4 4");
      break;
    case BorderTypeEnum.DashedLarge:
      path.setAttribute("stroke-dasharray", "6 6");
      break;
  }

  path.setAttribute("fill", "transparent");
  return path;
};

export const createRectPathSideBorderV2 = function (
  side: SideEnum,
  { x = 0, y = 0, width = 0, height = 0 }: RectAttr,
  { size = 0, type = BorderTypeEnum.Solid, color = "" }: BorderAttr,
  borderRadius: Array<number>
): SVGElement {
  let points: PointArray = [];
  let corners: Array<PointArray> = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
  let enterRadiusD;
  let outerRadiusD;
  let halfSize = size / 2;
  switch (side) {
    case SideEnum.Top:
      enterRadiusD = DirectionEnum.RightUp;
      outerRadiusD = DirectionEnum.RightDown;
      points = [
        corners[0][0],
        corners[0][1] + halfSize,
        corners[1][0],
        corners[1][1] + halfSize,
      ];
      break;
    case SideEnum.Right:
      enterRadiusD = DirectionEnum.RightDown;
      outerRadiusD = DirectionEnum.LeftDown;
      points = [
        corners[1][0] - halfSize,
        corners[1][1],
        corners[2][0] - halfSize,
        corners[2][1],
      ];
      break;
    case SideEnum.Bottom:
      enterRadiusD = DirectionEnum.LeftDown;
      outerRadiusD = DirectionEnum.LeftUp;
      points = [
        corners[2][0],
        corners[2][1] - halfSize,
        corners[3][0],
        corners[3][1] - halfSize,
      ];
      break;
    case SideEnum.Left:
      enterRadiusD = DirectionEnum.LeftUp;
      outerRadiusD = DirectionEnum.RightUp;
      points = [
        corners[3][0] + halfSize,
        corners[3][1],
        corners[0][0] + halfSize,
        corners[0][1],
      ];
      break;
  }
  let actions = calcPathActionsV2(
    points,
    borderRadius,
    enterRadiusD,
    outerRadiusD
  );

  let path = createSvgElement("path");
  path.setAttribute("d", toPathData(actions));
  if (size) {
    path.setAttribute("stroke-width", size + "");
  }
  if (color) {
    path.setAttribute("stroke", color);
  }
  switch (type) {
    case BorderTypeEnum.DashedShort:
      path.setAttribute("stroke-dasharray", "2 2");
      break;
    case BorderTypeEnum.Dashed:
      path.setAttribute("stroke-dasharray", "4 4");
      break;
    case BorderTypeEnum.DashedLarge:
      path.setAttribute("stroke-dasharray", "6 6");
      break;
  }

  path.setAttribute("fill", "transparent");
  return path;
};

const getBorderOption = function (...objs: Array<BorderAttr>): BorderAttr {
  return {
    size: getObjectValue("size", ...objs),
    type: getObjectValue("type", ...objs),
    color: getObjectValue("color", ...objs),
  };
};

export const createRectPathBorder = function (
  attr: RectAttr
): Array<SVGElement> {
  // 创建边线
  let {
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderRadius,
  } = attr;
  // 圆角
  borderRadius = getBorderRadius(borderRadius);
  // [上, 右, 下, 左]
  return [
    createRectPathSideBorder(
      SideEnum.Top,
      attr,
      getBorderOption(borderTop, border),
      borderRadius[0]
    ),
    createRectPathSideBorder(
      SideEnum.Right,
      attr,
      getBorderOption(borderRight, border),
      borderRadius[1]
    ),
    createRectPathSideBorder(
      SideEnum.Bottom,
      attr,
      getBorderOption(borderBottom, border),
      borderRadius[2]
    ),
    createRectPathSideBorder(
      SideEnum.Left,
      attr,
      getBorderOption(borderLeft, border),
      borderRadius[3]
    ),
  ];
};

export const createRectPathBorderV2 = function (
  attr: RectAttr
): Array<SVGElement> {
  // 创建边线
  let {
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderRadius,
  } = attr;
  // 圆角
  borderRadius = getBorderRadius(borderRadius);
  // [上, 右, 下, 左]
  return [
    createRectPathSideBorderV2(
      SideEnum.Top,
      attr,
      getBorderOption(borderTop, border),
      [borderRadius[0], borderRadius[1]]
    ),
    createRectPathSideBorderV2(
      SideEnum.Right,
      attr,
      getBorderOption(borderRight, border),
      [borderRadius[1], borderRadius[2]]
    ),
    createRectPathSideBorderV2(
      SideEnum.Bottom,
      attr,
      getBorderOption(borderBottom, border),
      [borderRadius[2], borderRadius[3]]
    ),
    createRectPathSideBorderV2(
      SideEnum.Left,
      attr,
      getBorderOption(borderLeft, border),
      [borderRadius[3], borderRadius[0]]
    ),
  ];
};
