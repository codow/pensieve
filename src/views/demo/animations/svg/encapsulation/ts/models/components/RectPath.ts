// ========================================================
// 定义一个矩形生成器
// @author wangyb
// @createTime 2023-06-01 13:49:53
// ========================================================

import {
  BorderTypeDashArrayMap,
  ColorEnum,
  SideEnum,
  SideNameMap,
} from "../../constants";
import { RectAttr } from "../../interfaces";
import {
  calcRectBorderPathData,
  createRectPath,
  createRectPathBorderV2,
} from "../../shapes/RectPath";
import { createSvgElement } from "../../shapes/base";
import { defineInnerProps } from "../../utils/object";
import SvgRectModel, { ISvgRectModelOptions } from "./Rect";

class SvgRectPathModel extends SvgRectModel {
  constructor(options: ISvgRectModelOptions = {}) {
    super(options);
  }

  initShape(): void {
    this.$el = createSvgElement("svg");
    this.bindRef("root", this.$el);
    defineInnerProps(this.$el, {
      $model: {
        value: this,
      },
    });
    // 背景
    let bg = createRectPath({
      ...(this.$options as RectAttr),
      x: 0,
      y: 0,
    });
    this.appendChild(bg, "bg");
    // header背景
    let borderRadius = this.$options.borderRadius || [];
    let headerBg = createRectPath({
      x: 0,
      y: 0,
      width: +this.getOption("width"),
      height: 24,
      border: this.getBorderOption(),
      borderRadius: [borderRadius[0] || 0, borderRadius[1] || 0, 0, 0],
      fill: this.getOption("headerFill", this.getOption("fill")),
    });
    this.appendChild(headerBg, "headerBg");
    // 边
    if (this.$options.sideMode === "multiple") {
      let sideMap = createRectPathBorderV2({
        ...(this.$options as RectAttr),
        x: 0,
        y: 0,
        border: this.getBorderOption(),
        borderRadius,
      });
      for (let side in sideMap) {
        this.appendChild(
          sideMap[side],
          "border" + SideNameMap[side as unknown as SideEnum]
        );
      }
    } else {
      let side = createSvgElement("path", {
        d: calcRectBorderPathData({
          ...(this.$options as RectAttr),
          x: 0,
          y: 0,
        }),
        fill: "none",
      });
      this.appendChild(side, "border");
    }
    // 内容
  }

  render(): void {
    // 创建Svg
    let width = this.getOption("width", 100);
    let height = this.getOption("height", 100);
    let fill = this.getOption("fill", ColorEnum.White);
    this.$el.setAttribute("width", width);
    this.$el.setAttribute("height", height);
    this.$el.setAttribute("x", this.getOption("x", "0"));
    this.$el.setAttribute("y", this.getOption("y", "0"));
    this.$refs.bg.setAttribute("fill", fill);
    // 设置头部背景
    let headerFill = this.getOption("headerFill", ColorEnum.White);
    this.$refs.headerBg.setAttribute("fill", headerFill);

    // 设置边框样式
    let borderSize = this.getOption("borderSize", null);
    // 重新计算边的路径
    let borderType = this.getOption("borderType", null);
    let dashArray = BorderTypeDashArrayMap[borderType] || "";
    let borderColor = this.getOption("borderColor", "Black");
    let sideEl: Element;
    for (let key in SideNameMap) {
      sideEl = this.$refs["border" + SideNameMap[key]];
      if (sideEl) {
        sideEl.setAttribute("stroke-width", borderSize);
        sideEl.setAttribute("stroke-dasharray", dashArray);
        sideEl.setAttribute("stroke", borderColor);
      }
    }
  }
}

export default SvgRectPathModel;
