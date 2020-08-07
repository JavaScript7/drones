// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store/index'
import axios from './assets/axios'
import qs from 'qs'
import '$stat/css/base.css'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Button,
  Select,
  Alert,
  Table,
  TableColumn,
  Dialog,
  Input,
  Row,
  Col,
  Option,
  Upload,
  Pagination,
  DatePicker,
  Form,
  FormItem,
  Tree,
  Message,
  Steps,
  Step,
  Popconfirm,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup
} from 'element-ui'
import App from './App'
import router from './router'
// import videoPlayer from 'vue-video-player'
// import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
// import 'videojs-flash'
// require('vue-video-player/src/custom-theme.css')// import 'vue-video-player/src/custom-theme.css'
// import 'videojs-contrib-hls'

import Video from "video.js"
import "video.js/dist/video-js.min.css"
Video.options.flash.swf = '../static/js/video-js.swf'
Vue.prototype.$video = Video

import api from './util/api'
import bus from './assets/bus'

import * as filters from './assets/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Vue.use(videoPlayer)

Vue.prototype.$axios = axios
Vue.prototype.api = api

Vue.config.productionTip = false

Vue.prototype.$bus = bus

Vue.use(Button)
Vue.use(Select)
Vue.use(Alert)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Option)
Vue.use(Upload)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tree)
Message.install = Vue => Vue.prototype.$message = Message
Vue.use(Message)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Popconfirm)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
// Vue.use(MessageBox)
// Alert.install = Vue => Vue.prototype.$alert = Alert

Vue.directive('auth', {
  bind (el, binding, vnode) { // v-auth:show(name: auth, arg: show)
    // el.disabled = false
    console.log(binding)
  },
  inserted (el, binding) {
    console.log(binding)
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // console.log(store.state.login)
    // if (store.state.token === 'token') {
    //   next()
    // } else {
    //   next({path: '', query: {redirect: to.fullPath}})
    // }
    next()
  } else {
    next()
  }
  // if (to.path === '/login') {
  //   next()
  // } else {
  //   let token = localStorage.getItem('token')
  //   if (token) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
