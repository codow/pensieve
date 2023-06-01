// ========================================================
// 汇总常量
// @author wangyb
// @createTime 2023-06-01 14:16:30
// ========================================================

/**
 * 移动方向
 */
export enum DirectionEnum {
  Up = 1,
  Down,
  Left,
  Right,
  LeftUp,
  LeftDown,
  RightUp,
  RightDown,
}

/**
 * 边类型
 */
export enum SideEnum {
  Top = 1,
  Bottom,
  Left,
  Right,
}

export const SideNameMap = {
  [SideEnum.Top]: "Top",
  [SideEnum.Bottom]: "Bottom",
  [SideEnum.Left]: "Left",
  [SideEnum.Right]: "Right",
};

/**
 * 边类型
 */
export enum RectCornerEnum {
  LeftTop = 1,
  RightDown,
  LeftDown,
  RightTop,
}

export const RectCornerNameMap = {
  [RectCornerEnum.LeftTop]: "LeftTop",
  [RectCornerEnum.RightDown]: "RightDown",
  [RectCornerEnum.LeftDown]: "LeftDown",
  [RectCornerEnum.RightTop]: "RightTop",
};

export enum BorderTypeEnum {
  Solid = 1,
  Dashed,
  DashedShort,
  DashedLarge,
}

export enum ColorEnum {
  White = "#ffffff",
  Black = "#000000",
  Primary = "#1890ff",
  Success = "#52c41a",
  Info = "#bfbfbf",
  Danger = "#f5222d",
  Warn = "#fa8c16",
}

export enum PathActionEnum {
  Moveto = "M",
  Lineto = "L",
  HorizontalLineto = "H",
  VerticalLineto = "V",
  Curveto = "C",
  SmoothCurveto = "S",
  QuadraticBezierCurve = "Q",
  SmoothQuadraticBezierCurveto = "T",
  EllipticalArc = "A",
  Closepath = "Z",
}
