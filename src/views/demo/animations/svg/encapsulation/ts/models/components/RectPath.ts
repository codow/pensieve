// ========================================================
// 定义一个矩形生成器
// @author wangyb
// @createTime 2023-06-01 13:49:53
// ========================================================

import { RectAttr } from "../../interfaces";
import { createRectPath, createRectPathBorderV2 } from "../../shapes/RectPath";
import SvgRectModel, { ISvgRectModelOptions } from "./Rect";

class SvgRectPathModel extends SvgRectModel {
  constructor(options: ISvgRectModelOptions = {}) {
    super(options);
  }

  initShape(): void {
    super.initShape();
    console.log(this.$options);
    let bg = createRectPath(this.$options as RectAttr);
    this.$el.appendChild(bg);
    let sides = createRectPathBorderV2(this.$options as RectAttr);
    sides.forEach((side) => {
      this.$el.appendChild(side);
    });
    console.log("sides", sides);
    this.bindRef("bg", bg);
  }

  render(): void {
    // 创建Svg
    let width = this.getOption("width", 100);
    let height = this.getOption("height", 100);
    this.$el.setAttribute("width", width);
    this.$el.setAttribute("height", height);
  }
}

export default SvgRectPathModel;
