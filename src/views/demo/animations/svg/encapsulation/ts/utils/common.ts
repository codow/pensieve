// ========================================================
// 基础工具
// @author wangyb
// @createTime 2023-06-07 17:31:25
// ========================================================

export function sleep(time: number) {
  let timeStamp = new Date().getTime();
  let endTime = timeStamp + time;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (new Date().getTime() > endTime) {
      return;
    }
  }
}
