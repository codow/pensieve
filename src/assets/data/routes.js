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
    children: [
      {
        name: 'index',
        path: '/index',
        meta: {
          title: '首页',
          keepAlive: true
        },
        component: () => import('@/views/home')
      },
      // 动画
      {
        name: 'demo-animation',
        path: '/demo/animation',
        component: () => import('@/views/layout/empty.vue'),
        children: [
          {
            name: 'demo-animation-canvas',
            path: 'canvas',
            component: () => import('@/views/layout/empty.vue'),
            children: [
              {
                name: 'demo-animation-canvas-demo01',
                path: 'demo01',
                component: () => import('@/views/demo/animations/canvas/demo1')
              },
              {
                name: 'demo-animation-canvas-demo-bouncing-balls',
                path: 'bouncing-balls',
                component: () =>
                  import('@/views/demo/animations/canvas/bouncing-balls')
              },
              {
                name: 'demo-animation-canvas-demo-walk-right',
                path: 'walk-right',
                component: () =>
                  import('@/views/demo/animations/canvas/walk-right')
              },
              {
                name: 'demo-animation-canvas-demo-frame-rate',
                path: 'frame-rate',
                component: () =>
                  import('@/views/demo/animations/canvas/frame-rate-test')
              }
            ]
          },
          {
            name: 'DemoAnimationEmMath',
            path: 'EmMath',
            component: () => import('@/views/layout/empty.vue'),
            children: [
              {
                name: 'DemoAnimationEmMathMatrixDemo',
                path: 'MatrixDemo',
                component: () =>
                  import('@/views/demo/animations/math/demo/matrix.vue')
              }
            ]
          }
        ]
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
      },
      {
        name: 'common-utils-css-cursor',
        path: '/common/utils/css/cursor',
        component: () => import('@/views/common-utils/css/cursor'),
        meta: {
          title: 'CSS游标',
          keepAlive: true
        }
      },
      {
        name: 'common-utils-excel-sql-concat-generate',
        path: '/common/utils/excel/sql/concat/generate',
        component: () =>
          import('@/views/common-utils/excel/sql-concat-generate'),
        meta: {
          title: 'Excel SQL拼接语句生成',
          keepAlive: true
        }
      },
      {
        name: 'common-utils-data-string-filter',
        path: '/common/utils/data/string/filter',
        component: () => import('@/views/common-utils/data/string-filter'),
        meta: {
          title: '数据过滤',
          keepAlive: true
        }
      },
      {
        name: 'common-utils-data-tree-handler',
        path: '/common/utils/data/tree/handler',
        component: () => import('@/views/common-utils/data/tree-handler'),
        meta: {
          title: '树数据生成',
          keepAlive: true
        }
      },
      {
        name: 'common-utils-big-data-generate',
        path: '/common/utils/big/data/generate',
        component: () => import('@/views/common-utils/data/big-data-generate'),
        meta: {
          title: '测试数据生成',
          keepAlive: true
        }
      },
      {
        name: 'common-utils-number-data-generate',
        path: '/common/utils/number/data/generate',
        component: () =>
          import('@/views/common-utils/data/number-data-generate'),
        meta: {
          title: '数字生成',
          keepAlive: true
        }
      },
      {
        name: 'common-utils-uuid-data-generate',
        path: '/common/utils/uuid/data/generate',
        component: () => import('@/views/common-utils/data/uuid-data-generate'),
        meta: {
          title: '数字生成',
          keepAlive: true
        }
      },
      {
        name: 'Games',
        path: 'games',
        component: () => import('@/views/layout/empty.vue'),
        meta: {
          title: '游戏',
          keepAlive: true
        },
        children: [
          {
            name: 'GamesFramework',
            path: 'framework',
            component: () => import('@/views/layout/empty.vue'),
            meta: {
              title: '游戏世界观',
              keepAlive: true
            },
            children: [
              {
                name: 'GamesFrameworkWuxing',
                path: 'wuxing',
                component: () => import('@/views/games/framework/wuxing'),
                meta: {
                  title: '五行',
                  keepAlive: true
                }
              }
            ]
          }
        ]
      },
      // 错误页面
      {
        name: '404',
        path: '/404',
        meta: {
          title: '访问失败'
        },
        component: () => import('@/views/error/404')
      }
    ]
  }
]
