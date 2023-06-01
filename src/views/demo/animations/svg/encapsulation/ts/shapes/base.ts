// ========================================================
// Svg基础能力
// @author wangyb
// @createTime 2023-06-01 17:40:25
// ========================================================

const DefaultXmlns = "http://www.w3.org/2000/svg";

const createSvgElement = function (tag: string) {
  return document.createElementNS(DefaultXmlns, tag);
};

export { createSvgElement };
