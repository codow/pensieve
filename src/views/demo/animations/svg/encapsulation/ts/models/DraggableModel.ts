// ========================================================
// 允许被拖动的元素
// @author wangyb
// @createTime 2023-06-05 16:34:32
// ========================================================

import { onMouseDown } from "../plugins/draggable";
import SvgSelectableModel from "./SelectableModel";

class SvgDraggableModel extends SvgSelectableModel {
  initEvents(): void {
    super.initEvents();
    this.$el.addEventListener("mousedown", onMouseDown);
  }
}

export default SvgDraggableModel;
