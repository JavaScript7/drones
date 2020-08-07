import axios from 'axios'
import qs from 'qs'

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
    const res = response.data
    // console.log(response.status)
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        // store.dispatch('FedLogOut').then(() => {
        //   location.reload()
        // })
      }
      console.log(res)
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default instance