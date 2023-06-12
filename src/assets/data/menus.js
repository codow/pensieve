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
  }, {
    id: "10113",
    label: 'TS测试',
    icon: '',
    url: '/demo/ts',
    children: [
      {
        id: '1011301',
        label: 'TS hello',
        icon: '',
        url: '/demo/ts/hello'
      }
    ]
  }, {
    id: "10114",
    label: '响应式和Table布局示例',
    icon: '',
    url: '/demo/table/div'
  }, {
    id: "10115",
    label: 'Flex布局示例',
    icon: '',
    url: '/demo/flex'
  }, {
    id: "10116",
    label: '富文本框（TinyMCE）',
    icon: '',
    url: '/demo/rich-editor'
  }, {
    id: "10117",
    label: '文字识别',
    icon: '',
    children: [
      {
        id: "1011701",
        label: '百度OCR',
        icon: '',
        url: '/demo/ocr/baidu'
      }
    ]
  }]
}, {
  id: "10118",
  label: '动画',
  icon: '',
  children: [
    {
      id: "1011801",
      label: '3D',
      icon: '',
      children: [{
        id: "101180101",
        label: 'Hello',
        icon: '',
        url: '/demo/animation/3d/hello',
      }, {
        id: "101180102",
        label: 'PORSCHE 911',
        icon: '',
        url: '/demo/animation/3d/porsche-911',
      }]
    },
    {
      id: "1011802",
      label: 'SVG',
      icon: '',
      children: [{
        id: "101180201",
        label: 'SVG对象封装',
        icon: '',
        children: [
          {
            id: "10118020101",
            label: '封装示例',
            icon: '',
            url: '/demo/animation/svg/encapsulation',
          },
          {
            id: "10118020102",
            label: 'SVG图标绘制',
            icon: '',
            url: '/demo/animation/svg/encapsulation/icon',
          },
        ]
      },
      {
        id: "101180202",
        label: 'SVG示例',
        icon: '',
        children: [
          {
            id: "10118020201",
            label: 'SVG-PATH示例',
            icon: '',
            url: '/demo/animation/svg/demo/path',
          },
        ]
      }]
    }
  ]
}, {
  id: '997',
  label: '在线表单',
  icon: '',
  url: '/form',
  children: [
    {
      id: "99701",
      label: '表单管理',
      icon: '',
      url: '/form/manage'
    },
    {
      id: "99702",
      label: '表单设计',
      icon: '',
      url: '/form/designer'
    },
    {
      id: "99703",
      label: '动态表单(Render)',
      icon: '',
      url: '/form/dynamic/render'
    },
    {
      id: "99704",
      label: '动态表单(Template)',
      icon: '',
      url: '/form/dynamic/template'
    },
    {
      id: "99705",
      label: '属性编辑',
      icon: '',
      url: '/form/attributes/editors'
    }
  ]
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
      }, {
        id: "9980303",
        label: '测试数据生成',
        icon: '',
        url: '/common/utils/big/data/generate'
      }, {
        id: "9980304",
        label: '数字生成',
        icon: '',
        url: '/common/utils/number/data/generate'
      }, {
        id: "9980305",
        label: 'UUID生成',
        icon: '',
        url: '/common/utils/uuid/data/generate'
      }]
    }, {
      id: "99804",
      label: 'CSS',
      icon: '',
      url: '/common/utils/css',
      children: [{
        id: "9980401",
        label: '游标',
        icon: '',
        url: '/common/utils/css/cursor'
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