// ========================================================
// 首页相关的菜单
// @author wangyb
// @createTime 2023-05-31 09:49:54
// ========================================================

export default [{
  id: "1",
  label: '首页',
  icon: '',
  url: '/index'
}, {
  id: "999",
  label: '系统管理',
  icon: '',
  url: '/system',
  children: [{
    id: "99901",
    label: '组织管理',
    icon: '',
    url: '/system/org/manage'
  }, {
    id: "99902",
    label: '人员管理',
    icon: '',
    url: '/system/user/manage'
  }, {
    id: "99903",
    label: '员工管理',
    icon: '',
    url: '/system/employee/manage'
  }]
}]
