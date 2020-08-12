import axios from 'axios'
import qs from 'qs'
// import Vue from 'vue'
// import Router from 'vue-router'
import { MessageBox } from 'element-ui'

const ur2 = 'http://8.129.9.170:4596'
const url1 = 'https://10.0.1.146:4596'
const url = 'https://dim.meiyafly.com/sapi'
axios.defaults.baseURL = {
  development: url,
  test: url,
  production: url
}[process.env.NODE_ENV]

const instance = axios.create({
  // baseURL: '/api',
  // headers: {
  //   get: {
  //     // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  //   },
  //   post: {
  //     // 'Content-Type': 'application/json'
  //     // 'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  // },
  withCredentials: false,
  timeout: 1000,
  // transformRequest: [function (data) {
  //   return qs.stringify(data)
  // }]
})

// request拦截器 request interceptor
instance.interceptors.request.use(
  config => {
    // console.log(config)
    // POST传参序列化
    // if (config.method === "post") {
    //   config.data = qs.stringify(config.data)
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// respone拦截器
instance.interceptors.response.use(
  response => {
    let res = response.data // {data: {Data: '', Msg: '', Status: ''}, status: 200}
    // console.log(res)
    if (res.Msg === '认证失败，权限错误') {
      MessageBox.alert('登录信息超时，请重新登录！', '登录超时', {
        callback: action => {
          location.href = '/login'
        }
      })
      return false
    }
    // if (res.Status && res.Status !== 200) { // 登录超时,重新登录
    //   if (res.Status === 401) {
    //     store.dispatch('FedLogOut').then(() => {
    //       location.reload()
    //     })
    //   }
    //   return Promise.reject(res || 'error')
    // } else {}
    return Promise.resolve(res)
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default instance