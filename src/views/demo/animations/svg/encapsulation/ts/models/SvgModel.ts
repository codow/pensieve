// ========================================================
// 一个svg模型，保存svg的属性，规定如何绘制一个svg，包含状态机制
// @author wangyb
// @createTime 2023-05-31 10:34:31
// ========================================================

import { cloneDeep } from "lodash";
import { defineInnerProps } from "../utils/object";
import {
  ModelStatusEnum,
  ModelStatusPostfixMap,
  ModelStatusPrefixMap,
} from "../constants";
import { getModelByEvent } from "../utils/model";
import { createSvgElement } from "../shapes/base";

export interface ISvgModel {
  // 用来存储对应的dom元素
  $el: Element;
  $options: ISvgModelOptions;
  status: ModelStatusEnum;
  [propName: string]: any;

  render(): void;
  setAttribute(name: string, value: any): void;
  setAttributes(attrs: Object): void;
  setOptions(options: ISvgModelOptions): void;
  setOption(name: string, value: any, status?: ModelStatusEnum): void;
  getOption(name, defaultVal): any;
  destroy(): void;
}

export interface ISvgModelOptions {
  x?: Number;
  y?: Number;
  width?: Number;
  height?: Number;
  fill?: String;
  // 事件处理
  onClick?: Function;
  status?: ModelStatusEnum;
  [propName: string]: any;
}

const onModelClick = function (event) {
  let model = getModelByEvent(event) as unknown as SvgModel;
  if (!model) {
    return;
  }
  model.$options.onClick && model.$options.onClick(model, event);
};

class SvgModel implements ISvgModel {
  $el: Element;
  $options: ISvgModelOptions;
  status: ModelStatusEnum;
  [propName: string]: any;

  constructor(options: ISvgModelOptions = {}) {
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
      status: {
        value: options.status || ModelStatusEnum.Default,
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
    this.initEvents();
    this.render();
  }

  initShape() {
    // 创建Svg
    this.$el = createSvgElement("svg");
    defineInnerProps(this.$el, {
      $model: {
        value: this,
      },
    });
  }

  initEvents() {
    this.$el.addEventListener("click", onModelClick);
  }

  render(): void {
    this.$el.setAttribute("width", this.getOption("width", "100"));
    this.$el.setAttribute("height", this.getOption("height", "100"));
    this.$el.setAttribute("x", this.getOption("x", "0"));
    this.$el.setAttribute("y", this.getOption("y", "0"));
    this.$el.setAttribute("fill", this.getOption("fill", "none"));
  }

  /**
   * 延迟重绘，当创建了延迟重绘后，延迟期间不会再接收延迟重绘
   * @param delay
   */
  renderDelay(delay = 1000 / 60) {
    if (this.__renderDelayTimer) {
      return;
    }
    this.__renderDelayTimer = setTimeout(() => {
      this.render();
      this.__renderDelayTimer = null;
    }, delay);
  }

  getStatus(): ModelStatusEnum {
    return this.status;
  }

  setStatus(status: ModelStatusEnum) {
    this.status = status;
    this.renderDelay();
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

  setOption(
    name: string,
    value: any,
    status: ModelStatusEnum = ModelStatusEnum.Default
  ): void {
    name = ModelStatusPrefixMap[status] + name + ModelStatusPostfixMap[status];
    this.$options[name] = value;
    this.renderDelay();
  }

  getOption(name: any, defaultVal?: any, status?: ModelStatusEnum) {
    let defaultName = name;
    status = status || this.getStatus();
    if (status) {
      name =
        ModelStatusPrefixMap[status] + name + ModelStatusPostfixMap[status];
    }
    let val = this.$options[name] || this.$options[defaultName];
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

  bindRef(name: string, svgEl: Element) {
    this.$refs[name] = svgEl;
    svgEl.setAttribute("name", name);
  }

  insertChild(child: Element | SvgModel, index: number, name?: string) {
    if (!this.$el) {
      if (process.env.NODE_ENV !== "dev") {
        console.error("模型未初始化");
      }
      return;
    }
    // 最后插入
    if (index < 0 || index > this.$el.children.length) {
      this.appendChild(child, name);
      return;
    }
    // 在元素前插入
    let beforeChildEl: Element = this.$el.children[index];
    this.insertBefore(child, beforeChildEl, name);
  }

  insertBefore(
    child: Element | SvgModel,
    beforeChild: Element | SvgModel,
    name?: string
  ) {
    if (!this.$el) {
      if (process.env.NODE_ENV !== "dev") {
        console.error("模型未初始化");
      }
      return;
    }
    let childEl: Element;
    if (child instanceof SvgModel) {
      childEl = (child as SvgModel).$el;
    } else {
      childEl = child as Element;
    }
    if (!childEl) {
      if (process.env.NODE_ENV !== "dev") {
        console.error("子模型未初始化");
      }
      return;
    }
    let beforeChildEl: Element;
    if (beforeChild instanceof SvgModel) {
      beforeChildEl = (beforeChild as SvgModel).$el;
    } else {
      beforeChildEl = beforeChild as Element;
    }
    if (!beforeChildEl) {
      if (process.env.NODE_ENV !== "dev") {
        console.error("指定位置模型未初始化");
      }
      return;
    }
    this.$el.insertBefore(childEl, beforeChildEl);
    if (name) {
      this.bindRef(name, childEl);
    }
  }

  insertAfter(
    child: Element | SvgModel,
    afterChild: Element | SvgModel,
    name?: string
  ) {
    if (!this.$el) {
      if (process.env.NODE_ENV !== "dev") {
        console.error("模型未初始化");
      }
      return;
    }
    let afterChildEl: Element;
    if (afterChild instanceof SvgModel) {
      afterChildEl = (afterChild as SvgModel).$el;
    } else {
      afterChildEl = afterChild as Element;
    }
    if (!afterChildEl) {
      if (process.env.NODE_ENV !== "dev") {
        console.error("指定位置模型未初始化");
      }
      return;
    }
    let index = this.$el.children.length;
    for (let i = index - 1; i >= 0; i--) {
      if (this.$el.children[i] === afterChildEl) {
        index = i;
        break;
      }
    }
    this.insertChild(child, index, name);
  }

  appendChild(child: Element | SvgModel, name?: string) {
    if (!this.$el) {
      if (process.env.NODE_ENV !== "dev") {
        console.error("模型未初始化");
      }
      return;
    }
    let childEl: Element;
    if (child instanceof SvgModel) {
      childEl = (child as SvgModel).$el;
    } else {
      childEl = child as Element;
    }
    if (!childEl) {
      if (process.env.NODE_ENV !== "dev") {
        console.error("子模型未初始化");
      }
      return;
    }
    this.$el.appendChild(childEl);
    if (name) {
      this.bindRef(name, childEl);
    }
  }
}

export default SvgModel;
