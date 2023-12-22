export default [
  {
    id: '1',
    label: '首页',
    icon: '',
    url: '/index'
  },
  {
    id: '101',
    label: '示例',
    icon: '',
    children: []
  },
  {
    id: '10118',
    label: '动画',
    icon: '',
    children: [
      {
        id: '1011801',
        label: '3D',
        icon: '',
        children: [
          {
            id: '101180101',
            label: 'Hello',
            icon: '',
            url: '/demo/animation/3d/hello'
          },
          {
            id: '101180102',
            label: 'PORSCHE 911',
            icon: '',
            url: '/demo/animation/3d/porsche-911'
          }
        ]
      },
      {
        id: '1011802',
        label: 'SVG',
        icon: '',
        children: [
          {
            id: '101180201',
            label: 'SVG对象封装',
            icon: '',
            children: [
              {
                id: '10118020101',
                label: '封装示例',
                icon: '',
                url: '/demo/animation/svg/encapsulation'
              },
              {
                id: '10118020102',
                label: 'SVG图标绘制',
                icon: '',
                url: '/demo/animation/svg/encapsulation/icon'
              },
              {
                id: '10118020103',
                label: 'SVG虚拟滚动',
                icon: '',
                url: '/demo/animation/svg/encapsulation/virtual-scroll'
              }
            ]
          },
          {
            id: '101180202',
            label: 'SVG示例',
            icon: '',
            children: [
              {
                id: '10118020201',
                label: 'SVG-PATH示例',
                icon: '',
                url: '/demo/animation/svg/demo/path'
              }
            ]
          }
        ]
      },
      {
        id: '1011803',
        label: 'Canvas',
        icon: '',
        children: [
          {
            id: '101180302',
            label: '示例',
            icon: '',
            children: [
              {
                id: '10118030201',
                label: 'Canvas-Demo01示例',
                icon: '',
                url: '/demo/animation/canvas/demo01'
              },
              {
                id: '10118030261',
                label: 'Canvas-Bouncing-Balls示例',
                icon: '',
                url: '/demo/animation/canvas/bouncing-balls'
              },
              {
                id: '10118030262',
                label: 'Canvas-Walk-Right示例',
                icon: '',
                url: '/demo/animation/canvas/walk-right'
              },
              {
                id: '10118030263',
                label: 'Canvas-Frame-Rate-Test示例',
                icon: '',
                url: '/demo/animation/canvas/frame-rate'
              }
            ]
          }
        ]
      },
      {
        id: '1011804',
        label: '数学',
        icon: '',
        children: [
          {
            id: '101180401',
            label: '示例',
            icon: '',
            children: [
              {
                id: '10118040101',
                label: '矩阵示例',
                icon: '',
                url: '/demo/animation/EmMath/MatrixDemo'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '10299',
    label: '游戏',
    icon: '',
    children: [
      {
        id: '1029901',
        label: '世界观',
        icon: '',
        children: [
          {
            id: '102990101',
            label: '五行',
            icon: '',
            url: '/games/framework/wuxing'
          }
        ]
      }
    ]
  },
  {
    id: '998',
    label: '常用工具',
    icon: '',
    url: '/common/utils',
    children: [
      {
        id: '99801',
        label: '编辑器',
        icon: '',
        url: '/common/utils/editor',
        children: [
          {
            id: '9980101',
            label: '颜色编辑器',
            icon: '',
            url: '/common/utils/editor/color'
          }
        ]
      },
      {
        id: '99802',
        label: 'Excel工具',
        icon: '',
        url: '/common/utils/excel',
        children: [
          {
            id: '9980201',
            label: 'Excel SQL拼接语句生成',
            icon: '',
            url: '/common/utils/excel/sql/concat/generate'
          }
        ]
      },
      {
        id: '99803',
        label: '数据工具',
        icon: '',
        url: '/common/utils/data',
        children: [
          {
            id: '9980301',
            label: '字符串数据过滤',
            icon: '',
            url: '/common/utils/data/string/filter'
          },
          {
            id: '9980302',
            label: '树型数据处理',
            icon: '',
            url: '/common/utils/data/tree/handler'
          },
          {
            id: '9980303',
            label: '测试数据生成',
            icon: '',
            url: '/common/utils/big/data/generate'
          },
          {
            id: '9980304',
            label: '数字生成',
            icon: '',
            url: '/common/utils/number/data/generate'
          },
          {
            id: '9980305',
            label: 'UUID生成',
            icon: '',
            url: '/common/utils/uuid/data/generate'
          }
        ]
      },
      {
        id: '99804',
        label: 'CSS',
        icon: '',
        url: '/common/utils/css',
        children: [
          {
            id: '9980401',
            label: '游标',
            icon: '',
            url: '/common/utils/css/cursor'
          }
        ]
      }
    ]
  }
]
