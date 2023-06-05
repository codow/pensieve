// ========================================================
// 可以被选中的模型
// @author wangyb
// @createTime 2023-06-05 17:42:21
// ========================================================

import { ModelStatusNextMap } from "../constants";
import { getModelByEvent } from "../utils/model";
import SvgSerializableModel from "./SerializableModel";
import SvgModel from "./SvgModel";

const onModelClick = function (event) {
  let model = getModelByEvent(event) as unknown as SvgModel;
  if (!model) {
    return;
  }
  // 切换状态
  model.setStatus(ModelStatusNextMap[model.status]);
  model.$options.onClick && model.$options.onClick(model, event);
};

class SvgSelectableModel extends SvgSerializableModel {
  initEvents(): void {
    this.$el.addEventListener("click", onModelClick);
  }
}

export default SvgSelectableModel;
