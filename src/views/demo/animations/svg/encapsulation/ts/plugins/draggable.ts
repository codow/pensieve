// ========================================================
// 托转插件
// @author wangyb
// @createTime 2023-06-05 22:46:44
// ========================================================

import SvgModel from "../models/SvgModel";
import { getModelByEvent } from "../utils/model";

interface IDragCache {
  dragging: boolean;
  models: Array<SvgModel>;
  // 拖拽开始的模型坐标
  originModelX: number;
  originModelY: number;
  // 拖拽开始的坐标
  originX: number;
  originY: number;
  // 拖拽开始时的相对于容器的位置
  originOffsetX: number;
  originOffsetY: number;
  // 当前的坐标
  lastX: number;
  lastY: number;
  // 当前对于容器的位置
  lastOffsetX: number;
  lastOffsetY: number;
  // 移动的位置
  movedX: number;
  movedY: number;
}
// 全局变量, 记录当前拖拽的元素
let __dragCache: IDragCache;

const initDragCache = function () {
  __dragCache = {
    dragging: false,
    models: [],
    originModelX: 0,
    originModelY: 0,
    originX: 0,
    originY: 0,
    originOffsetX: 0,
    originOffsetY: 0,
    lastX: 0,
    lastY: 0,
    lastOffsetX: 0,
    lastOffsetY: 0,
    movedX: 0,
    movedY: 0,
  };
};

initDragCache();

export const onMouseDown = function (e) {
  if (!__dragCache) {
    this.initDragCache();
  }
  // 记录被拖拽的元素
  let model = getModelByEvent(e);
  __dragCache.models = [model];
  __dragCache.originModelX = model.getOption("x", 0);
  __dragCache.originModelY = model.getOption("y", 0);
  __dragCache.lastX = __dragCache.originX = e.clientX;
  __dragCache.lastY = __dragCache.originY = e.clientY;
  __dragCache.lastOffsetX = __dragCache.originOffsetX = e.offsetX;
  __dragCache.lastOffsetY = __dragCache.originOffsetY = e.offsetY;
  __dragCache.movedX = __dragCache.movedY = 0;
  // 绑定拖拽元素
  window.document.body.addEventListener("mousemove", onMouseMove);
  window.document.body.addEventListener("mouseup", onMouseUp);
};

export const onMouseMove = function (e) {
  __dragCache.dragging = true;
  __dragCache.movedX = e.clientX - __dragCache.originX;
  __dragCache.movedY = e.clientY - __dragCache.originY;
  __dragCache.lastX = e.clientX;
  __dragCache.lastY = e.clientY;
  __dragCache.lastOffsetX = e.offsetX;
  __dragCache.lastOffsetY = e.offsetY;
  // 每个模型计算位置
  __dragCache.models.forEach((model) => {
    // 更新位置
    model.setOption("x", __dragCache.originModelX + __dragCache.movedX);
    model.setOption("y", __dragCache.originModelY + __dragCache.movedY);
  });
};

export const onMouseUp = function () {
  initDragCache();
  window.document.body.removeEventListener("mousemove", onMouseMove);
  window.document.body.removeEventListener("mouseup", onMouseUp);
};
