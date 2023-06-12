// ========================================================
// 绘制一条线
// @author wangyb
// @createTime 2023-06-06 09:13:05
// ========================================================

import {
  BorderTypeDashArrayMap,
  BorderTypeEnum,
  ColorEnum,
  LineModeEnum,
} from "../../constants";
import { BorderAttr, PointArray } from "../../interfaces";
import { createSvgElement } from "../../shapes/base";
import { toBorderOptions } from "../../utils/css";
import SvgSelectableModel from "../SelectableModel";
import { ISvgModelOptions } from "../SvgModel";
import { ISvgRectModelOptions } from "./Rect";

interface ILineArrowOptions {
  width: number;
  height?: number;
  fill?: string;
  border?: string; // 边线配置
  borderSize: number; // 线宽
  borderColor?: string; // 颜色
  borderType?: BorderTypeEnum; // 实线/虚线/长虚线/短虚线
}

interface ISvgLineModelOptions extends ISvgModelOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  points?: PointArray;
  mode?: LineModeEnum; // 直线/折线
  border?: string; // 边线配置
  borderSize: number; // 线宽
  borderColor?: string; // 颜色
  borderType?: BorderTypeEnum; // 实线/虚线/长虚线/短虚线
  radius?: number; // 圆角
  startArrow?: boolean | ILineArrowOptions;
  obstacleProvider?: Function; // 提供需要用来判断是否碰撞的障碍物
  collisionDetection?: Function; // 碰撞检测，判断连线是否有阻碍
}

/**
 * 创建线结束Arrow
 * @returns 线段结束Arrow
 */
export const createArrow = function (color) {
  let arrow = createSvgElement("marker", {
    markerWidth: "4",
    markerHeight: "4",
    refX: "3",
    refY: "2",
    orient: "auto",
    markerUnits: "strokeWidth",
  });
  arrow.innerHTML = `<path d="M 0 0 L 4 2 L 0 4 z" fill="${color}"/>`;
  return arrow;
};

class SvgLineModel extends SvgSelectableModel {
  constructor(options: ISvgLineModelOptions) {
    super(options);
    // 检测参数
    // 初始化路径参数
    // 处理边配置
    this.setBorderOptions(options);
  }

  initShape(): void {
    // super.initShape();
    // 创建一个线段
    let line = createSvgElement("polyline", {
      "stroke-width": this.getOption("borderSize", 0),
      "stroke-darharray":
        BorderTypeDashArrayMap[this.getOption("borderType")] || "",
      stroke: this.getOption("borderColor", ColorEnum.Black),
      fill: "none",
    });
    // this.appendChild(line, "line");
    this.$el = line;
    this.bindRef("line", line);
  }

  render(): void {
    let { x1, y1, x2, y2, points } = this.$options;
    if (!points) {
      points = [x1, y1, x2, y2];
    }
    this.$refs.line.setAttribute("points", points.join(" "));
  }

  setBorderOptions(options: ISvgRectModelOptions = {}) {
    // 设置边
    let { border, borderSize, borderType, borderColor } = options;
    let config = toBorderOptions(border);
    if (config) {
      this.$options.border = config;
      this.setBorderSize(config.size);
      this.setBorderType(config.type);
      this.setBorderColor(config.color);
    }
    // 设置边宽
    this.setBorderSize(borderSize);
    // 设置边类型
    this.setBorderType(borderType);
    // 设置边颜色
    this.setBorderColor(borderColor);
  }

  setBorderOption({ size, type, color }: BorderAttr) {
    this.setBorderSize(size);
    this.setBorderType(type);
    this.setBorderColor(color);
    this.renderDelay();
  }

  setBorderSize(borderSize: Number | String) {
    if (borderSize === undefined) {
      return;
    }
    this.$options.borderSize = borderSize;
    this.renderDelay();
  }

  setBorderType(borderType: BorderTypeEnum) {
    // 无效设置
    if (borderType === undefined) {
      return;
    }
    this.$options.borderType = borderType;
    this.renderDelay();
  }

  setBorderColor(borderColor: String) {
    // 无效设置
    if (borderColor === undefined) {
      return;
    }
    this.$options.borderColor = borderColor;
    this.renderDelay();
  }
}

export default SvgLineModel;
