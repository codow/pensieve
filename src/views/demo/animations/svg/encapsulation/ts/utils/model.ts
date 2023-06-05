// ========================================================
// 模型常用的方法
// @author wangyb
// @createTime 2023-06-05 17:08:01
// ========================================================

import SvgModel from "../models/SvgModel";

export function getModelByEvent(event: Event): SvgModel {
  let currentTarget: any = event.target as Element;
  let model = currentTarget.$model;
  while (!model) {
    currentTarget = currentTarget.parentElement;
    if (!currentTarget) {
      return;
    }
    model = currentTarget.$model;
  }
  return model as SvgModel;
}
