// ========================================================
// 实验如何封装一个Svg对象比较合理
// 需要实现的功能：
// 1、使用ts，使用继承，
// 2、需要有状态机制，可以根据不同的状态进行渲染
// 3、创建对象时可以传入options，根据options更新
// 4、能够触发不同的事件，能够让外部监听事件
// 5、对扩展开放，可以让外部自由扩展
// 6、将el对象和Model绑定起来
// 7、需要合理的安装方式
//
// @author wangyb
// @createTime 2023-05-31 10:26:39
// ========================================================

import SvgModel from "./models/SvgModel";
import SvgRectModel from "./models/components/Rect";
import SvgRectPathModel from "./models/components/RectPath";

export { SvgModel, SvgRectModel, SvgRectPathModel };
