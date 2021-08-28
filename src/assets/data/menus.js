export default [{
  id: "1",
  label: '首页',
  icon: '',
  url: '/index'
}, {
  id: "101",
  label: '示例',
  icon: '',
  url: '/demo',
  children: [{
    id: "10101",
    label: 'Vue计算属性',
    icon: '',
    url: '/demo/computed-attr'
  }, {
    id: "10102",
    label: 'Vue动态监听',
    icon: '',
    url: '/demo/dynamic-watch'
  }, {
    id: "10103",
    label: '表单设计器',
    icon: '',
    url: '/demo/designer'
  }, {
    id: "10105",
    label: 'Vue嵌套插槽',
    icon: '',
    url: '/demo/deep-nested-slot'
  }, {
    id: "10106",
    label: '表格布局',
    icon: '',
    url: '/demo/demo-table',
    children: [{
      id: "1010601",
      label: '设计器（新）',
      icon: '',
      url: '/demo/demo-table/new'
    }, {
      id: "1010602",
      label: '设计器（旧）',
      icon: '',
      url: '/demo/demo-table/old'
    }, {
      id: "1010603",
      label: '数据',
      icon: '',
      url: '/demo/demo-table/data'
    }]
  }, {
    id: "10107",
    label: '自定义组件封装',
    icon: '',
    url: '/demo/c-container'
  }, {
    id: "10108",
    label: 'EL表格',
    icon: '',
    url: '/demo/el-table'
  }, {
    id: "10109",
    label: 'AG表格',
    icon: '',
    url: '/demo/ag-grid'
  }, {
    id: "10110",
    label: '多语言文本框',
    icon: '',
    url: '/demo/input-multilingual'
  }, {
    id: "10111",
    label: '虚拟滚动表格',
    icon: '',
    url: '/demo/virtual-scroll-table'
  }, {
    id: "10112",
    label: '拖拽功能',
    icon: '',
    url: '/demo/drag'
  }]
}, {
  id: '998',
  label: '常用工具',
  icon: '',
  url: '/common/utils',
  children: [
    {
      id: "99801",
      label: '编辑器',
      icon: '',
      url: '/common/utils/editor',
      children: [{
        id: "9980101",
        label: '颜色编辑器',
        icon: '',
        url: '/common/utils/editor/color'
      }]
    },
    {
      id: "99802",
      label: 'Excel工具',
      icon: '',
      url: '/common/utils/excel',
      children: [{
        id: "9980201",
        label: 'Excel SQL拼接语句生成',
        icon: '',
        url: '/common/utils/excel/sql/concat/generate'
      }]
    },
    {
      id: "99803",
      label: '数据工具',
      icon: '',
      url: '/common/utils/data',
      children: [{
        id: "9980301",
        label: '字符串数据过滤',
        icon: '',
        url: '/common/utils/data/string/filter'
      }, {
        id: "9980302",
        label: '树型数据处理',
        icon: '',
        url: '/common/utils/data/tree/handler'
      }]
    }
  ]
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