// ========================================================
// 可被序列化的模型
// @author wangyb
// @createTime 2023-06-05 17:57:11
// ========================================================

import SvgModel from "./SvgModel";
import { cloneDeep } from "lodash";

class SvgSerializableModel extends SvgModel {
  toJSON() {
    let options: Object = cloneDeep(this.options || {});
    Object.keys(options).forEach((key) => {
      // 更新数据
      options[key] = this.$options[key];
    });
    return options;
  }

  toJSONString() {
    return JSON.stringify(this.toJSON());
  }
}

export default SvgSerializableModel;
