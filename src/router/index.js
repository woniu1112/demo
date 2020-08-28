function uploadComponent(com) {
  return () =>
    import('@/views/' + com);
}

export default new VueRouter({

  scrollBehavior(to, from, savedPosition) {
      return {
        x: 0,
        y: 0
      }
  },
  mode: 'hash',
  routes: [{
      path: '/',
      redirect: {
        path: '/setTime'
      }
    },
    {
      path: '/setTime',
      name: 'setTime',
      component: uploadComponent('setTime/index'),
      meta: {
        title: '设置时间'
      }
    },
    {
      path: '/test',
      name: 'Test',
      component: uploadComponent("test"),
      meta: {
        title: '测试页面'
      }
    },{
      path: '/test1',
      name: 'Test1',
      component: uploadComponent("test1"),
      meta: {
        title: '测试页面1'
      }
    }
  ]
})
