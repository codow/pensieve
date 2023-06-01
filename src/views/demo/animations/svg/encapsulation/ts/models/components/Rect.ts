// ========================================================
// 定义一个矩形生成器
// @author wangyb
// @createTime 2023-06-01 13:49:53
// ========================================================

import SvgModel, { ISvgModelOptions } from "../SvgModel";
import { BorderTypeEnum, SideEnum, SideNameMap } from "../../constants";
import { toBorderOptions } from "../../utils/css";
import { toFixed } from "../../utils/math";

interface ISvgModelBorderOptions {
  size?: Number | String;
  type?: BorderTypeEnum;
  color?: String;
}

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
  borderType?: String;
  borderTopType?: String;
  borderRightType?: String;
  borderBottomType?: String;
  borderLeftType?: String;
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
    this.$el.setAttribute("version", "1.1");
    this.$el.setAttribute("baseProfile", "full");
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
    let { border, borderTop, borderBottom, borderLeft, borderRight } = options;
    // 拆分border
    let config = toBorderOptions(border);
    if (config) {
      this.setBorderSize(config.size);
      this.setBorderType(config.type);
      this.setBorderColor(config.color);
    }
    let configArr = [border, borderTop, borderBottom, borderLeft, borderRight];
    configArr.forEach((item, side) => {
      side = side as unknown as SideEnum;
      config = toBorderOptions(item);
      if (!config) {
        return;
      }
      this.setBorderSize(side, config.size);
      this.setBorderType(side, config.type);
      this.setBorderColor(side, config.color);
    });
  }

  setBorderOption(
    side: SideEnum,
    { size, type, color }: ISvgModelBorderOptions
  ) {
    this.setBorderSize(side, size);
    this.setBorderType(side, type);
    this.setBorderColor(side, color);
    this.renderDelay();
  }

  setBorderSize(
    side: SideEnum | Number | String,
    borderSize?: Number | String
  ) {
    //
    let sideName = "";
    if (borderSize !== undefined) {
      sideName = SideNameMap[side as SideEnum] || "";
    } else {
      borderSize = side as Number | String;
    }
    this.$options["border" + sideName + "Size"] = borderSize;
    this.renderDelay();
  }

  setBorderType(side: SideEnum | BorderTypeEnum, borderType?: BorderTypeEnum) {
    //
    if (borderType !== undefined) {
      this.$options["border" + SideNameMap[side as SideEnum] + "Type"] =
        borderType;
    } else {
      borderType = side as BorderTypeEnum;
      this.$options["borderType"] = borderType;
    }
    this.renderDelay();
  }

  setBorderColor(side: SideEnum | Number | String, borderColor?: String) {
    //
    if (borderColor !== undefined) {
      this.$options["border" + SideNameMap[side as SideEnum] + "Color"] =
        borderColor;
    } else {
      borderColor = side as String;
      this.$options["borderColor"] = borderColor;
    }
    this.renderDelay();
  }

  setBorderRadius(borderRadius: Number | String) {
    //
    this.$options["borderRadius"] = borderRadius;
    this.renderDelay();
  }
}

export default SvgRectModel;
