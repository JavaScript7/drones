import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login' // 默认直接路径
    }, {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/login'], resolve),
      meta: {
        requireAuth: false
      }
    }, {
      path: '/interface',
      name: 'interface',
      component: resolve => require(['@/pages/interface'], resolve),
      meta: {
        requireAuth: true
      },
      children: [{
        path: '/home',
        name: 'home',
        meta: {
          requireAuth: true
        },
        component: resolve => require(['@/pages/home'], resolve)
      }, {
        path: '/inspection',
        name: 'inspection',
        meta: {
          requireAuth: true
        },
        component: resolve => require(['@/pages/inspection'], resolve)
      }, {
        path: '/missionCenter',
        name: 'missionCenter',
        meta: {
          requireAuth: true
        },
        component: resolve => require(['@/pages/missionCenter'], resolve),
        children: [{
          path: '/review',
          name: 'review',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['@/pages/review'], resolve)
        }, {
          path: '/distribute',
          name: 'distribute',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['@/pages/distribute'], resolve)
        }]
      }, {
        path: '/dataCenter',
        name: 'dataCenter',
        meta: {
          requireAuth: true
        },
        component: resolve => require(['@/pages/dataCenter'], resolve),
        children: [{
          path: '/picture',
          name: 'picture',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['@/pages/picture'], resolve)
        }, {
          path: '/video',
          name: 'video',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['@/pages/video'], resolve)
        }, {
          path: '/statistics',
          name: 'statistics',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['@/pages/statistics'], resolve)
        }, {
          path: '/flightLog',
          name: 'flightLog',
          meta: {
            requireAuth: true
          },
          component: resolve => require(['@/pages/flightLog'], resolve)
          // children: [{
          //   path: '/track',
          //   name: 'track',
          //   meta: {
          //     requireAuth: true
          //   },
          //   component: resolve => require(['@/components/track'], resolve)
          // }]
        }]
      }, {
        path: '/teamManage',
        name: 'teamManage',
        meta: {
          requireAuth: true
        },
        component: resolve => require(['@/pages/teamManage'], resolve),
        children: [{
          path: '/memberManage',
          name: 'memberManage',
          component: resolve => require(['@/components/memberManage'], resolve),
          meta: {
            requireAuth: true
          }
        }, {
          path: '/deviceDetail',
          name: 'deviceDetail',
          component: resolve => require(['@/components/deviceDetail'], resolve),
          meta: {
            requireAuth: true
          }
        }, {
          path: '/authManage',
          name: 'authManage',
          component: resolve => require(['@/components/authManage'], resolve),
          meta: {
            requireAuth: true
          }
        }]
      }, {
        path: '/record',
        name: 'record',
        meta: {
          requireAuth: true
        },
        component: resolve => require(['@/pages/record'], resolve)
      }]
    }, {
      path: '/live:src',
      name: 'live',
      meta: {
        requireAuth: true
      },
      component: resolve => require(['@/pages/liveVideo'], resolve)
    }, {
      path: '/test',
      name: 'test',
      meta: {
        requireAuth: true
      },
      component: resolve => require(['@/pages/test'], resolve)
    }, {
      path: '/track:id',
      name: 'track',
      meta: {
        requireAuth: true
      },
      component: resolve => require(['@/components/track'], resolve)
    }, {
      path: '*',
      redirect: '/login'
    }
  ]
})
