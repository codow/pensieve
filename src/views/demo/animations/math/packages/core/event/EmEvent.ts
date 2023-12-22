// ========================================================
// 事件接口和通用事件
// @author wangyb
// @createTime 2023-11-28
// ========================================================

import { EmCanvasUnit } from "../canvas/EmCanvasUnit";

interface EmEvent {
  // js的事件
  rawEvent: Event;
  // 事件分类
  classify: String; // 点击，移动
  // 事件类型
  type: String;
  // 事件目标
  target: EmCanvasUnit;
  // 事件数据
  detail: Object;
}

class EmCommonEvent implements EmEvent {
  rawEvent: Event;
  classify: String;
  type: String;
  target: EmCanvasUnit;
  detail: Object;
}

export default EmCommonEvent;

export { EmEvent, EmCommonEvent };
