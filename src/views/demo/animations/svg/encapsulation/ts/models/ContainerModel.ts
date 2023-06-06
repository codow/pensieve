// ========================================================
// 容器模型
// @author wangyb
// @createTime 2023-06-05 16:06:25
// ========================================================

import { defineInnerProps } from "../utils/object";
import SvgSerializableModel from "./SerializableModel";
import SvgModel, { ISvgModelOptions } from "./SvgModel";

class SvgContainerModel extends SvgSerializableModel {
  models: Array<SvgModel>;

  constructor(options: ISvgModelOptions) {
    super(options);
    defineInnerProps(this, {
      models: {
        value: [],
      },
    });
  }

  bringToFront(...models: Array<SvgModel>) {
    // 重新插入到当前容器的最后
    models.forEach((model) => {
      this.appendChild(model);
    });
  }

  bringToBehind(...models: Array<SvgModel>) {
    // 插入到最前面的位置
    models.forEach((model) => {
      this.insertChild(model, 0);
    });
  }

  appendChild(child: SvgModel | Element, name?: string): void {
    super.appendChild(child, name);
    if ((<SvgModel>child).$el) {
      // 给子模型设置容器
      defineInnerProps(child, {
        $parent: {
          value: this,
        },
      });
      if (!this.models.includes(child as SvgModel)) {
        this.models.push(child as SvgModel);
      }
    }
  }

  toJSON(): Object {
    let json = super.toJSON();
    json["models"] = this.models.map((model) => model.toJSON());
    return json;
  }
}

export default SvgContainerModel;
