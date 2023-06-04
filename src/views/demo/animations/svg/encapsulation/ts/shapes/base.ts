// ========================================================
// Svg基础能力
// @author wangyb
// @createTime 2023-06-01 17:40:25
// ========================================================

const DefaultXmlns = "http://www.w3.org/2000/svg";

const createSvgElement = function (tag: string): SVGElement {
  let svgEl = document.createElementNS(DefaultXmlns, tag);

  return svgEl;
};

export { createSvgElement };
