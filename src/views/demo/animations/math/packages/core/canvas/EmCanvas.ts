// ========================================================
// 定义一个画布
// @author wangyb
// @createTime 2023-11-28
// ========================================================

interface EmCanvas {
  width: Number;
  height: Number;
}

class EmCommonCanvas implements EmCanvas {
  width: Number;
  height: Number;
}

export default EmCommonCanvas;

export { EmCanvas, EmCommonCanvas };
