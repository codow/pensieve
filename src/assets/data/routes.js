export default [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    name: 'base',
    path: '/',
    redirect: '/index',
    component: () => import('@/views'),
    children: [{
      name: 'index',
      path: '/index',
      meta: {
        title: '首页',
        keepAlive: true
      },
      component: () => import('@/views/home')
    },
    {
      name: 'demo-computed-attr',
      path: '/demo/computed-attr',
      component: () => import('@/views/demo/computed-attr'),
      meta: {
        title: 'Vue计算属性',
        keepAlive: true
      }
    },
    {
      name: 'demo-dynamic-watch',
      path: '/demo/dynamic-watch',
      component: () => import('@/views/demo/dynamic-watch'),
      meta: {
        title: 'Vue动态监听',
        keepAlive: true
      }
    },
    {
      name: 'demo-designer',
      path: '/demo/designer',
      component: () => import('@/views/demo/designer'),
      meta: {
        title: '表单设计器',
        keepAlive: true
      }
    },
    {
      name: 'demo-deep-nested-slot',
      path: '/demo/deep-nested-slot',
      component: () => import('@/views/demo/deep-nested-slot'),
      meta: {
        title: 'Vue嵌套插槽',
        keepAlive: true
      }
    },
    {
      name: 'demo-table',
      path: '/demo/table',
      component: () => import('@/views/demo/table'),
      children: [
        {
          path: '',
          redirect: 'new'
        }, {
          name: 'demo-table-new',
          path: 'new',
          component: () => import('@/views/demo/table/src/index-new'),
          meta: {
            title: '表格设计器（新）',
            keepAlive: true
          }
        }, {
          name: 'demo-table-old',
          path: 'old',
          component: () => import('@/views/demo/table/src/index-old'),
          meta: {
            title: '表格设计器（旧）',
            keepAlive: true
          }
        }, {
          name: 'demo-table-data',
          path: 'data',
          component: () => import('@/views/demo/table/src/index-table'),
          meta: {
            title: '表格数据',
            keepAlive: true
          }
        }
      ]
    },
    {
      name: 'demo-c-container',
      path: '/demo/c-container',
      component: () => import('@/views/demo/c-container'),
      meta: {
        title: '自定义组件封装',
        keepAlive: true
      }
    },
    {
      name: 'demo-el-table',
      path: '/demo/el-table',
      component: () => import('@/views/demo/el-table'),
      meta: {
        title: 'EL表格',
        keepAlive: true
      }
    },
    {
      name: 'demo-ag-grid',
      path: '/demo/ag-grid',
      component: () => import('@/views/demo/ag-grid'),
      meta: {
        title: 'AG表格',
        keepAlive: true
      }
    },
    {
      name: 'demo-input-multilingual',
      path: '/demo/input-multilingual',
      component: () => import('@/views/demo/multilingual'),
      meta: {
        title: '多语言文本框',
        keepAlive: true
      }
    },
    {
      name: 'demo-virtual-scroll-table',
      path: '/demo/virtual-scroll-table',
      component: () => import('@/views/demo/virtual-scroll-table'),
      meta: {
        title: '虚拟滚动表格',
        keepAlive: true
      }
    },
    {
      name: 'demo-virtual-scroll-table-detail',
      path: '/demo/virtual-scroll-table-detail',
      component: () => import('@/views/demo/virtual-scroll-table/detail'),
      meta: {
        title: '表格设计器（新）',
        keepAlive: true
      }
    },
    {
      name: 'demo-drag',
      path: '/demo/drag',
      component: () => import('@/views/demo/drag'),
      meta: {
        title: '拖拽功能',
        keepAlive: true
      }
    },
    {
      name: 'demo-ts-hello',
      path: '/demo/ts/hello',
      component: () => import('@/views/ts/hello.ts'),
      meta: {
        title: '拖拽功能',
        keepAlive: true
      }
    },
    {
      name: 'demo-table-div',
      path: '/demo/table/div',
      component: () => import('@/views/demo/table-div/index.vue'),
      meta: {
        title: '响应式和Table布局',
        keepAlive: true
      }
    },
    {
      name: 'demo-flex',
      path: '/demo/flex',
      component: () => import('@/views/demo/flex/index.vue'),
      meta: {
        title: 'Flex布局',
        keepAlive: true
      }
    },
    {
      name: 'demo-rich-editor',
      path: '/demo/rich-editor',
      component: () => import('@/views/demo/rich-editor/index.vue'),
      meta: {
        title: '富文本框（TinyMCE）',
        keepAlive: true
      }
    },
    // OCR接口
    {
      name: 'demo-ocr-baidu',
      path: '/demo/ocr/baidu',
      component: () => import('@/views/demo/ocr/baidu.vue'),
      meta: {
        title: '百度OCR',
        keepAlive: true
      }
    },
    // 动画
    {
      name: 'demo-animation',
      path: '/demo/animation',
      component: () => import('@/views/layout/empty.vue'),
      children: [
        {
          name: 'demo-animation-3d',
          path: '3d',
          component: () => import('@/views/layout/empty.vue'),
          children: [
            {
              name: 'demo-animation-3d-hello',
              path: 'hello',
              component: () => import('@/views/demo/animations/3d/hello'),
              meta: {
                title: '3D动画--Hello',
                keepAlive: true
              }
            },
            {
              name: 'demo-animation-3d-porsche-911',
              path: 'porsche-911',
              component: () => import('@/views/demo/animations/3d/porsche_911'),
              meta: {
                title: '3D动画--保时捷911',
                keepAlive: true
              }
            },
          ]
        },
        {
          name: 'demo-animation-svg',
          path: 'svg',
          component: () => import('@/views/layout/empty.vue'),
          children: [
            {
              name: 'demo-animation-svg-encapsulation',
              path: 'encapsulation',
              component: () => import('@/views/demo/animations/svg/encapsulation'),
              meta: {
                title: '图形对象封装'
              }
            }
          ]
        }
      ]
    },
    // 在线表单
    {
      name: 'form-manage',
      path: '/form/manage',
      component: () => import('@/views/form/manage.vue'),
      meta: {
        title: '表单管理',
        keepAlive: true
      }
    },
    {
      name: 'form-designer',
      path: '/form/designer',
      component: () => import('@/views/form/designer.vue'),
      meta: {
        title: '表单设计',
        keepAlive: true
      }
    },
    {
      name: 'form-dynamic-render',
      path: '/form/dynamic/render',
      component: () => import('@/views/form/dynamic-render.vue'),
      meta: {
        title: '动态表单(Render)',
        keepAlive: true
      }
    },
    {
      name: 'form-dynamic-template',
      path: '/form/dynamic/template',
      component: () => import('@/views/form/dynamic-template.vue'),
      meta: {
        title: '动态表单(template)',
        keepAlive: true
      }
    },
    {
      name: 'form-attributes-editors',
      path: '/form/attributes/editors',
      component: () => import('@/views/form/attributes/index.vue'),
      meta: {
        title: '属性编辑',
        keepAlive: true
      }
    },
    // 常用工具
    {
      name: 'common-utils-color-editor',
      path: '/common/utils/editor/color',
      component: () => import('@/views/common-utils/editor/color'),
      meta: {
        title: '颜色编辑器',
        keepAlive: true
      }
    }, {
      name: 'common-utils-css-cursor',
      path: '/common/utils/css/cursor',
      component: () => import('@/views/common-utils/css/cursor'),
      meta: {
        title: 'CSS游标',
        keepAlive: true
      }
    }, {
      name: 'common-utils-excel-sql-concat-generate',
      path: '/common/utils/excel/sql/concat/generate',
      component: () => import('@/views/common-utils/excel/sql-concat-generate'),
      meta: {
        title: 'Excel SQL拼接语句生成',
        keepAlive: true
      }
    }, {
      name: 'common-utils-data-string-filter',
      path: '/common/utils/data/string/filter',
      component: () => import('@/views/common-utils/data/string-filter'),
      meta: {
        title: '数据过滤',
        keepAlive: true
      }
    }, {
      name: 'common-utils-data-tree-handler',
      path: '/common/utils/data/tree/handler',
      component: () => import('@/views/common-utils/data/tree-handler'),
      meta: {
        title: '树数据生成',
        keepAlive: true
      }
    }, {
      name: 'common-utils-big-data-generate',
      path: '/common/utils/big/data/generate',
      component: () => import('@/views/common-utils/data/big-data-generate'),
      meta: {
        title: '测试数据生成',
        keepAlive: true
      }
    }, {
      name: 'common-utils-number-data-generate',
      path: '/common/utils/number/data/generate',
      component: () => import('@/views/common-utils/data/number-data-generate'),
      meta: {
        title: '数字生成',
        keepAlive: true
      }
    }, {
      name: 'common-utils-uuid-data-generate',
      path: '/common/utils/uuid/data/generate',
      component: () => import('@/views/common-utils/data/uuid-data-generate'),
      meta: {
        title: '数字生成',
        keepAlive: true
      }
    },
    // 错误页面
    {
      name: '404',
      path: '/404',
      meta: {
        title: '访问失败'
      },
      component: () => import('@/views/error/404')
    }]
  }
]