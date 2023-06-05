// ========================================================
// 定义一个矩形生成器
// @author wangyb
// @createTime 2023-06-01 13:49:53
// ========================================================

import { ISvgModelOptions } from "../SvgModel";
import { BorderTypeEnum } from "../../constants";
import { getBorderRadius, toBorderOptions } from "../../utils/css";
import { toFixed } from "../../utils/math";
import { BorderAttr } from "../../interfaces";
import { isString, isNumber } from "lodash";
import SvgDraggableModel from "../DraggableModel";

export interface ISvgRectModelOptions extends ISvgModelOptions {
  // 使用css的border参数配置
  // border: 1px solid #ffffff;
  // 边: 边款 类型 颜色 圆角
  border?: String;
  // 边宽
  borderSize?: Number | String;
  // 边类型，实现，短虚线，长虚线等等
  borderType?: BorderTypeEnum;
  // 边颜色
  borderColor?: String;
  // 圆角
  // border-radius: 2px 4px;
  // border-radius: 2px;
  // border-radius: 2px 2px 2px 2px;
  borderRadius?: Number | String;
  [propName: string]: any;
}

class SvgRectModel extends SvgDraggableModel {
  constructor(options: ISvgRectModelOptions = {}) {
    super(options);
    // 处理边配置
    this.setBorderOptions(options);
    this.setBorderRadius(options.borderRadius);
  }

  render(): void {
    // 创建Svg
    this.$el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let width = this.getOption("width", 100);
    let height = this.getOption("height", 100);
    this.$el.setAttribute("width", width);
    this.$el.setAttribute("height", height);
    let content = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    let borderSize = +this.getOption("borderSize");
    let contentX = 0;
    let contentY = 0;
    let contentWidth: String | Number = "100%";
    let contentHeight: String | Number = "100%";
    if (borderSize > 0) {
      contentWidth = width - borderSize;
      contentHeight = height - borderSize;
      contentY = contentX = toFixed(borderSize / 2, 1);
    }
    content.setAttribute("x", contentX + "");
    content.setAttribute("y", contentY + "");
    content.setAttribute("width", contentWidth + "");
    content.setAttribute("height", contentHeight + "");
    content.setAttribute("stroke", this.getOption("borderColor"));
    content.setAttribute("stroke-width", this.getOption("borderSize"));
    let borderRadius = this.getOption("borderRadius");
    content.setAttribute("rx", borderRadius[0]);
    content.setAttribute("ry", borderRadius[1]);
    content.setAttribute("fill", this.getOption("fill", "blue"));

    this.$el.appendChild(content);
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

  setBorderRadius(borderRadius: Number | String) {
    // 处理为数组
    let radius: Array<number> = [];
    if (isString(borderRadius)) {
      radius = (borderRadius as String).split(/\s+/).map((item) => +item);
    }
    if (isNumber(borderRadius)) {
      radius = [borderRadius as number];
    }
    radius = getBorderRadius(radius);
    this.$options["borderRadius"] = radius;
    this.renderDelay();
  }

  getBorderOption(): BorderAttr {
    return {
      size: this.$options.borderSize,
      type: this.$options.borderType,
      color: this.$options.borderColor,
    };
  }
}

export default SvgRectModel;
