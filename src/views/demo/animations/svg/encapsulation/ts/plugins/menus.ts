// ========================================================
// 提供右键菜单的能力
// @author wangyb
// @createTime 2023-06-05 22:54:48
// ========================================================

import { Point } from "../interfaces";
import SvgModel from "../models/SvgModel";
import { getModelByEvent } from "../utils/model";

let __menu: HTMLElement = null;
let __menuModels: Array<SvgModel> = [];
let __containerModel: SvgModel = null;

const initMenu = function () {
  __menu = document.createElement("div");
  __menu.className = "demo-menu";
  __menu.style.position = "absolute";
  __menu.style.left = "-1000px";
  __menu.style.top = "-1000px";
  __menu.style.width = "240px";
  __menu.style.backgroundColor = "#ffffff";
  __menu.style.border = "1px solid #afafaf";
  __menu.style.borderTop = "none";
  window.document.body.appendChild(__menu);
};

const destroyMenu = function () {
  if (!__menu) {
    return;
  }
  __menu.remove();
  __menu = null;
  window.document.body.removeEventListener("click", onMenuOuterClick);
};

const openMenu = function (p: Point) {
  if (!__menu) {
    initMenu();
  }
  __menu.style.left = p.x + "px";
  __menu.style.top = p.y + "px";
  window.document.body.addEventListener("click", onMenuOuterClick);
};

const setMenuItems = function (items = []) {
  if (!__menu) {
    initMenu();
  }
  __menu.innerHTML = "";
  items.forEach((item) => {
    let menuItem = window.document.createElement("div");
    menuItem.className = "demo-menu-item";
    menuItem.style.height = "32px";
    menuItem.style.lineHeight = "32px";
    menuItem.style.padding = "0 10px";
    menuItem.innerHTML = item.label;
    menuItem.dataset.command = item.command;
    menuItem.dataset.target = item.target;
    menuItem.style.borderTop = "1px solid #afafaf";
    menuItem.style.cursor = "pointer";
    menuItem.addEventListener("click", onMenuItemClick);
    __menu.appendChild(menuItem);
  });
};

const onMenuOuterClick = function (e) {
  let target = e.target;
  if (!__menu.contains(target)) {
    destroyMenu();
  }
};

const onMenuItemClick = function (e) {
  let command = e.target.dataset.command;
  let target = e.target.dataset.target;
  let func;
  switch (target) {
    case "container":
      func = __containerModel[command] as Function;
      func && func.call(__containerModel, ...__menuModels);
      break;
    default:
      __menuModels.forEach((model) => {
        func = model[command];
        func && func.call(model);
      });
  }
  destroyMenu();
};

export function onContextMenu(e) {
  let model = getModelByEvent(e);
  // 获取model的容器
  let containerModel = model.$parent;
  // 根据model配置的菜单项来打开
  __containerModel = containerModel;
  //
  __menuModels = [model];
  // 设置菜单
  setMenuItems([
    {
      command: "bringToFront",
      target: "container",
      label: "置于顶层",
      icon: "",
    },
    {
      command: "bringToBehind",
      target: "container",
      label: "置于底层",
      icon: "",
    },
  ]);
  // 打开menu
  openMenu({ x: e.clientX, y: e.clientY });
  e.preventDefault();
  return false;
}
