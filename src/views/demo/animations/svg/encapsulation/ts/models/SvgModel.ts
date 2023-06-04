// ========================================================
// 一个svg模型，保存svg的属性，规定如何绘制一个svg，包含状态机制
// @author wangyb
// @createTime 2023-05-31 10:34:31
// ========================================================

import { cloneDeep } from "lodash";
import { defineInnerProps } from "../utils/object";

interface ISvgModel {
  // 用来存储对应的dom元素
  $el: Element;
  $options: ISvgModelOptions;
  [propName: string]: any;

  render(): void;
  setAttribute(name: string, value: any): void;
  setAttributes(attrs: Object): void;
  setOptions(options: ISvgModelOptions): void;
  getOption(name, defaultVal): any;
  destroy(): void;
}

export interface ISvgModelOptions {
  x?: Number;
  y?: Number;
  width?: Number;
  height?: Number;
  fill?: String;
  [propName: string]: any;
}

// interface ISvgModelConstructor {
//   new (options: Object): ISvgModel;
// }

class SvgModel implements ISvgModel {
  $el: Element;
  $options: ISvgModelOptions;
  [propName: string]: any;

  constructor(options: ISvgModelOptions = {}) {
    console.log("创建SvgModel", options);
    defineInnerProps(this, {
      // 根图形
      $el: {
        value: this.$el,
      },
      // 所有关联的对象
      $refs: {
        value: {},
      },
      $options: {
        // 互不影响
        value: cloneDeep(options),
      },
      options: {
        value: options,
      },
      __renderDelayTimer: {
        value: null,
      },
    });
  }

  /**
   * 模型初始化
   */
  init(): void {
    this.initShape();
    this.render();
  }

  initShape() {
    // 创建Svg
    this.$el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.$el.setAttribute("version", "1.1");
    this.$el.setAttribute("baseProfile", "full");
  }

  render(): void {
    this.$el.setAttribute("width", this.getOption("width", "100"));
    this.$el.setAttribute("height", this.getOption("height", "100"));
  }

  /**
   * 延迟重绘，当创建了延迟重绘后，延迟期间不会再接收延迟重绘
   * @param delay
   */
  renderDelay(delay = 30) {
    if (this.__renderDelayTimer) {
      return;
    }
    this.__renderDelayTimer = setTimeout(() => {
      this.render();
    }, delay);
  }

  setAttribute(name: string, value: any): void {
    if (!this.$el) {
      throw new Error("图形未初始化");
    }
    // this.$el.setAttributeNS("http://www.w3.org/2000/svg", name, value + "");
    this.$el.setAttribute(name, value + "");
  }

  setAttributes(attrs: Object = {}): void {
    // 给$el设置属性
    console.log("接收到属性", attrs);
  }

  setOptions(options: ISvgModelOptions): void {
    Object.assign(this.options, options);
    // 执行options计算，处理特殊属性，如边框等
    Object.assign(this.$options, options);
    this.renderDelay();
  }

  getOption(name: any, defaultVal?: any) {
    let val = this.$options[name];
    if (val === null || val === undefined) {
      val = defaultVal;
    }
    return val;
  }

  destroy(): void {
    console.log("模型被销毁了", this.$el);
    if (this.$el) {
      this.$el.remove();
      this.$el = null;
    }
  }

  bindRef(name: string, svgEl: SVGElement) {
    this.$refs[name] = svgEl;
    svgEl.setAttribute("name", name);
  }
}

export default SvgModel;
