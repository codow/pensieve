// ========================================================
// 一个svg模型，保存svg的属性，规定如何绘制一个svg，包含状态机制
// @author wangyb
// @createTime 2023-05-31 10:34:31
// ========================================================

import { get as getByPath, set as setByPath, isString } from "lodash";

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

const defineInnerProps = function (obj: Object, props: PropertyDescriptorMap) {
  let prop: PropertyDescriptor;
  let defaultProp: PropertyDescriptor;
  props = Object.assign({}, props);
  for (let key in props) {
    prop = props[key];
    defaultProp = {};
    if (!prop.get && !prop.set) {
      defaultProp.writable = true;
    }
    prop = Object.assign(defaultProp, prop, {
      enumerable: false,
    });
    props[key] = prop;
  }
  Object.defineProperties(obj, props);
};

const defineWatchProps = function (
  obj: Object,
  configs:
    | { [propName: string]: String }
    | { [propName: string]: { path: String; handler: Function } } = {},
  defaultHandler: Function
) {
  let prop: PropertyDescriptor;
  let config, field, path, handler;
  let props: PropertyDescriptorMap = {};
  for (let key in configs) {
    config = configs[key];
    field = key;
    if (isString(config)) {
      path = config;
      handler = null;
    } else {
      path = config.path;
      handler = config.handler;
    }
    prop = (function (_f, _p, _h) {
      return {
        get() {
          return getByPath(obj, _p);
        },
        set(newVal) {
          setByPath(obj, _p, newVal);
          _h && _h({ field: _f, path: _p, value: newVal });
        },
      };
    })(field, path, handler || defaultHandler);
    props[field] = prop;
  }
  Object.defineProperties(obj, props);
};

class SvgModel implements ISvgModel {
  $el: Element;
  $options: ISvgModelOptions;
  [propName: string]: any;

  constructor(options: ISvgModelOptions = {}) {
    console.log("创建SvgModel", options);
    defineInnerProps(this, {
      $el: {
        value: this.$el,
      },
      $options: {
        value: options,
      },
    });
    defineWatchProps(
      this,
      {
        width: "$options.width",
        height: "$options.height",
        fill: "$options.fill",
      },
      ({ field, value }) => {
        this.setAttribute(field, value);
      }
    );
  }

  render(): void {
    // 创建Svg
    this.$el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.$el.setAttribute("width", this.getOption("width", "100"));
    this.$el.setAttribute("height", this.getOption("height", "100"));
    this.$el.setAttribute("version", "1.1");
    this.$el.setAttribute("baseProfile", "full");
    let content = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    content.setAttribute("width", "100%");
    content.setAttribute("height", "100%");
    content.setAttribute("fill", this.getOption("fill", "blue"));

    this.$el.appendChild(content);
  }

  /**
   * 延迟重绘，当创建了延迟重绘后，延迟期间不会再接收延迟重绘
   * @param delay
   */
  renderDelay(delay = 30) {
    if (!("__renderDelayTimer" in this)) {
      defineInnerProps(this, {
        __renderDelayTimer: {
          value: null,
        },
      });
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
    this.$options = options;
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
}

export default SvgModel;
