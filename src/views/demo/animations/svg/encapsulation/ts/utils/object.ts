// ========================================================
// 提供对象的一些基本操作
// @author wangyb
// @createTime 2023-06-02 10:34:43
// ========================================================
import { get as getByPath, set as setByPath, isString } from "lodash";

export const defineInnerProps = function (
  obj: Object,
  props: PropertyDescriptorMap
) {
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

export const defineWatchProps = function (
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

export const getObjectValue = function (
  name: string | number,
  ...objs: Array<Object>
): any {
  //
  let value = undefined;
  objs.some((item) => {
    if (!item) {
      return false;
    }
    value = item[name];
    if (value !== undefined) {
      return true;
    }
  });
  return value;
};
