// ========================================================
// 接口 一个画布单元定义绘制一个图形的流程
// @author wangyb
// @createTime 2023-11-28
// ========================================================

import { EmEvent } from "../event";
import EmCanvas from "./EmCanvas";

interface EmCanvasUnit {
  canvas: EmCanvas;
  // =============属性方法 START =============
  setOptions(options: EmCanvasUnitOptions);
  // =============属性方法 END =============
  // =============事件方法 START =============
  addEventListener(eventName: String, eventHandler: Function);
  removeEventListener(eventName: String, eventHandler?: Function);
  triggerEvent(eventName, eventObject: EmEvent);
  // =============属性方法 END =============
  // =============生命周期 START =============
  create(options: EmCanvasUnitOptions);
  mount(canvas: EmCanvas);
  update();
  destroy();
  // =============生命周期 END =============
  // =============绘制 START =============
  render();
  // =============绘制 END =============
}

class EmCanvasUnitOptions {}

class EmCommonCanvasUnit implements EmCanvasUnit {
  canvas: EmCanvas;
  constructor(options?: EmCanvasUnitOptions) {
    // 初始化属性
    console.log(options);
  }
  setOptions(options: EmCanvasUnitOptions) {
    console.log(options);
  }
  create(options: EmCanvasUnitOptions) {
    console.log(options);
  }
  /**
   * 从画布中移除
   * 销毁本身对象的监听等
   */
  destroy() {
    throw new Error("Method not implemented.");
  }
  mount() {
    throw new Error("Method not implemented.");
  }
  update() {
    throw new Error("Method not implemented.");
  }
  render() {
    throw new Error("Method not implemented.");
  }

  removeEventListener(eventName: String, eventHandler: Function) {
    console.log(eventName, eventHandler);
  }
  addEventListener(eventName: String, eventHandler?: Function) {
    console.log(eventName, eventHandler);
  }
  triggerEvent(eventName: any, eventObject: EmEvent) {
    console.log(eventName, eventObject);
  }
}

export default EmCommonCanvasUnit;

export { EmCanvasUnit, EmCanvasUnitOptions, EmCommonCanvasUnit };
