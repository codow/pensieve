// ========================================================
// 定义一个矩形生成器
// @author wangyb
// @createTime 2023-06-01 13:49:53
// ========================================================

import { toFixed } from "../../utils/math";
import { calcRectPathData } from "../../utils/shape";
import SvgRectModel, { ISvgRectModelOptions } from "./Rect";

class SvgRectPathModel extends SvgRectModel {
  constructor(options: ISvgRectModelOptions = {}) {
    super(options);
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
      "path"
    );
    let borderSize = +this.getOption("borderSize");
    let contentX = 0;
    let contentY = 0;
    let contentWidth: number = width;
    let contentHeight: number = height;
    if (borderSize > 0) {
      contentWidth = width - borderSize;
      contentHeight = height - borderSize;
      contentY = contentX = toFixed(borderSize / 2, 1);
    }
    let borderRadius = this.getOption("borderRadius", "").split(/\s+/);
    borderRadius = borderRadius.map((item) => +item);
    content.setAttribute(
      "d",
      calcRectPathData({
        x: contentX,
        y: contentY,
        width: contentWidth,
        height: contentHeight,
        radius: borderRadius,
      })
    );
    content.setAttribute("stroke", this.getOption("borderColor"));
    content.setAttribute("stroke-width", this.getOption("borderSize"));
    content.setAttribute("fill", this.getOption("fill", "blue"));

    this.$el.appendChild(content);
  }
}

export default SvgRectPathModel;
