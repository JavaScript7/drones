/*
全局时间戳

import * as filters from './assets/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

*/

const timeStamp = (time, all = false, joiner = ':') => {
  let date = new Date(time * 1000)
  let y = date.getFullYear()
  let m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return all ? `${y}-${m}-${d} ${h}${joiner}${min}${joiner}${s}` : `${y}-${m}-${d}` 
}
const hoursMin = time => {
  let date = new Date(time * 1000)
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return `${h} : ${min}`
}

export {
  timeStamp,
  hoursMin
}