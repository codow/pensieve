// ========================================================
// 图片方法
// @author wangyb
// @createTime 2023-06-01 10:20:03
// ========================================================

export const svgToImage = function (svg: SVGAElement) {
  // 这里一定要给svg设置这两个命名空间，包含了image 则也需要加上xmlns:xlink 否则浏览器会报错不能下载图片
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  // 这里用来解决当svg中图超出边界时，需要全部完整保存下来的功能
  const toExport = svg.cloneNode(true) as SVGAElement;
  const bb = svg.getBBox();
  toExport.setAttribute(
    "viewBox",
    bb.x -
      20 +
      " " +
      (bb.y - 20) +
      " " +
      (bb.width + 40) +
      " " +
      (bb.height + 40)
  );
  toExport.setAttribute("width", bb.width + "");
  toExport.setAttribute("height", bb.height + "");
  // 转为base64 一定要加上unescape(encodeURIComponent，否则浏览器会报错
  return (
    "data:image/svg+xml;base64," +
    window.btoa(unescape(encodeURIComponent(toExport.outerHTML)))
  );
};
