export default [
  {
    name: 'base',
    path: '/',
    redirect: '/index',
    component: () => import('@/views'),
    children: [{
      name: 'index',
      path: '/index',
      meta: {
        title: '首页'
      },
      component: () => import('@/views/home')
    }, {
      name: 'demo',
      path: '/demo',
      component: () => import('@/views/demo'),
      children: [
        {
          path: '',
          redirect: 'computed-attr'
        },
        {
          name: 'demo-computed-attr',
          path: 'computed-attr',
          component: () => import('@/views/demo/computed-attr')
        },
        {
          name: 'demo-dynamic-watch',
          path: 'dynamic-watch',
          component: () => import('@/views/demo/dynamic-watch')
        },
        // {
        //   name: 'demo-designer',
        //   path: 'designer',
        //   component: () => import('@/views/demo/designer')
        // },
        {
          name: 'demo-color-editor',
          path: 'color-editor',
          component: () => import('@/views/demo/color-editor')
        },
        {
          name: 'demo-deep-nested-slot',
          path: 'deep-nested-slot',
          component: () => import('@/views/demo/deep-nested-slot')
        },
        {
          name: 'demo-table',
          path: 'table',
          component: () => import('@/views/demo/table'),
          children: [
            {
              path: '',
              component: () => import('@/views/demo/table/src/index-new')
            }, {
              name: 'demo-table-new',
              path: 'new',
              component: () => import('@/views/demo/table/src/index-new')
            }, {
              name: 'demo-table-old',
              path: 'old',
              component: () => import('@/views/demo/table/src/index-old')
            }, {
              name: 'demo-table-data',
              path: 'data',
              component: () => import('@/views/demo/table/src/index-table')
            }
          ]
        },
        {
          name: 'demo-c-container',
          path: 'c-container',
          component: () => import('@/views/demo/c-container')
        },
        {
          name: 'demo-el-table',
          path: 'el-table',
          component: () => import('@/views/demo/el-table')
        },
        {
          name: 'demo-ag-grid',
          path: 'ag-grid',
          component: () => import('@/views/demo/ag-grid')
        },
        {
          name: 'demo-input-multilingual',
          path: 'input-multilingual',
          component: () => import('@/views/demo/multilingual')
        },
        {
          name: 'demo-virtual-scroll-table',
          path: 'virtual-scroll-table',
          component: () => import('@/views/demo/virtual-scroll-table')
        },
        {
          name: 'demo-virtual-scroll-table-detail',
          path: 'virtual-scroll-table-detail',
          component: () => import('@/views/demo/virtual-scroll-table/detail')
        }
      ]
    }, {
      name: '404',
      path: '/404',
      meta: {
        title: '访问失败'
      },
      component: () => import('@/views/error/404')
    }]
  }, {
    name: 'demo-designer',
    path: '/demo/designer',
    component: () => import('@/views/demo/designer')
  }
]