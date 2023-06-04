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
  [0]: "",
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
  Volcano = "#fa541c",
  Cyan = "#13c2c2",
}

export enum PathActionEnum {
  Moveto = "M", // 开始移动到的位置
  Lineto = "L", // 移动至x,y
  LinetoR = "l", // 相对移动x,y
  HorizontalLineto = "H", // 横移至x
  HorizontalLinetoR = "h", // 相对横移x
  VerticalLineto = "V", // 纵移至y
  VerticalLinetoR = "v", // 相对纵移y
  Curveto = "C",
  CurvetoR = "c",
  SmoothCurveto = "S",
  SmoothCurvetoR = "s",
  QuadraticBezierCurve = "Q",
  QuadraticBezierCurveR = "q",
  SmoothQuadraticBezierCurveto = "T",
  SmoothQuadraticBezierCurvetoT = "t",
  EllipticalArc = "A", // 绝对位置绘制椭圆
  EllipticalArcR = "a", // 相对位置绘制椭圆
  Closepath = "Z",
}
