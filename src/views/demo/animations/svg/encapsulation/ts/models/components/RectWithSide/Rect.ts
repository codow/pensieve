// ========================================================
// 定义一个矩形生成器
// @author wangyb
// @createTime 2023-06-01 13:49:53
// ========================================================

import SvgModel, { ISvgModelOptions } from "../../SvgModel";
import { BorderTypeEnum, SideEnum, SideNameMap } from "../../../constants";
import { toBorderOptions } from "../../../utils/css";
import { toFixed } from "../../../utils/math";
import { BorderAttr } from "../../../interfaces";
import { isString, isNumber } from "lodash";

export interface ISvgRectModelOptions extends ISvgModelOptions {
  // 使用css的border参数配置
  // border: 1px solid #ffffff;
  // 边: 边款 类型 颜色 圆角
  border?: String;
  borderTop?: String;
  borderRight?: String;
  borderBottom?: String;
  borderLeft?: String;
  // 边宽
  borderSize?: Number | String;
  borderTopSize?: Number | String;
  borderRightSize?: Number | String;
  borderBottomSize?: Number | String;
  borderLeftSize?: Number | String;
  // 边类型，实现，短虚线，长虚线等等
  borderType?: BorderTypeEnum;
  borderTopType?: BorderTypeEnum;
  borderRightType?: BorderTypeEnum;
  borderBottomType?: BorderTypeEnum;
  borderLeftType?: BorderTypeEnum;
  // 边颜色
  borderColor?: String;
  borderTopColor?: String;
  borderRightColor?: String;
  borderBottomColor?: String;
  borderLeftColor?: String;
  // 圆角
  // border-radius: 2px 4px;
  // border-radius: 2px;
  // border-radius: 2px 2px 2px 2px;
  borderRadius?: Number | String;
  [propName: string]: any;
}

class SvgRectModel extends SvgModel {
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
    content.setAttribute("rx", this.getOption("borderRadius"));
    content.setAttribute("ry", this.getOption("borderRadius"));
    content.setAttribute("fill", this.getOption("fill", "blue"));

    this.$el.appendChild(content);
  }

  setBorderOptions(options: ISvgRectModelOptions = {}) {
    // 设置边
    let {
      border,
      borderTop,
      borderBottom,
      borderLeft,
      borderRight,
      borderSize,
      borderTopSize,
      borderRightSize,
      borderBottomSize,
      borderLeftSize,
      borderType,
      borderTopType,
      borderRightType,
      borderBottomType,
      borderLeftType,
      borderColor,
      borderTopColor,
      borderRightColor,
      borderBottomColor,
      borderLeftColor,
    } = options;
    let config;
    [border, borderTop, borderBottom, borderLeft, borderRight].forEach(
      (item, side) => {
        side = side as SideEnum;
        config = toBorderOptions(item);
        if (!config) {
          return;
        }
        this.$options["border" + SideNameMap[side]] = config;
        this.setBorderSize(config.size, side);
        this.setBorderType(config.type, side);
        this.setBorderColor(config.color, side);
      }
    );
    // 设置边宽
    this.setBorderSize(borderSize);
    this.setBorderSize(borderTopSize, SideEnum.Top);
    this.setBorderSize(borderBottomSize, SideEnum.Bottom);
    this.setBorderSize(borderLeftSize, SideEnum.Left);
    this.setBorderSize(borderRightSize, SideEnum.Right);
    // 设置边类型
    this.setBorderType(borderType);
    this.setBorderType(borderTopType, SideEnum.Top);
    this.setBorderType(borderBottomType, SideEnum.Bottom);
    this.setBorderType(borderLeftType, SideEnum.Left);
    this.setBorderType(borderRightType, SideEnum.Right);
    // 设置边颜色
    this.setBorderColor(borderColor);
    this.setBorderColor(borderTopColor, SideEnum.Top);
    this.setBorderColor(borderBottomColor, SideEnum.Bottom);
    this.setBorderColor(borderLeftColor, SideEnum.Left);
    this.setBorderColor(borderRightColor, SideEnum.Right);
    console.log(this.$options);
  }

  setBorderOption({ size, type, color }: BorderAttr, side?: SideEnum) {
    this.setBorderSize(size, side);
    this.setBorderType(type, side);
    this.setBorderColor(color, side);
    this.renderDelay();
  }

  setBorderSize(
    borderSize: Number | String,
    side?: SideEnum | Number | String
  ) {
    if (borderSize === undefined) {
      return;
    }
    let sideName = "";
    if (side !== undefined) {
      sideName = SideNameMap[side as SideEnum] || "";
    }
    this.$options["border" + sideName + "Size"] = borderSize;
    this.renderDelay();
  }

  setBorderType(borderType: BorderTypeEnum, side?: SideEnum | BorderTypeEnum) {
    // 无效设置
    if (borderType === undefined) {
      return;
    }
    let sideName = "";
    if (side !== undefined) {
      sideName = SideNameMap[side as SideEnum] || "";
    }
    this.$options["border" + sideName + "Type"] = borderType;
    this.renderDelay();
  }

  setBorderColor(borderColor: String, side?: SideEnum | Number | String) {
    // 无效设置
    if (borderColor === undefined) {
      return;
    }
    let sideName = "";
    if (side !== undefined) {
      sideName = SideNameMap[side as SideEnum] || "";
    }
    this.$options["border" + sideName + "Color"] = borderColor;
    this.renderDelay();
  }

  setBorderRadius(borderRadius: Number | String) {
    // 处理为数组
    let radius: Array<Number> = [];
    if (isString(borderRadius)) {
      radius = (borderRadius as String).split(/\s+/).map((item) => +item);
    }
    if (isNumber(borderRadius)) {
      radius = [borderRadius as Number];
    }
    this.$options["borderRadius"] = radius;
    this.renderDelay();
  }

  getBorderOption(side?: SideEnum): BorderAttr {
    let namePrefix = "border" + (side ? SideNameMap[side] : "");
    return {
      size: this.$options[namePrefix + "Size"],
      type: this.$options[namePrefix + "Type"],
      color: this.$options[namePrefix + "Color"],
    };
  }
}

export default SvgRectModel;
