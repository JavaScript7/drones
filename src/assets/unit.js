/**
 * 公共函数全局调用
 * main.js:
 *    import unit from './assets/unit'
 *    Vue.prototype.unit = unit
 * 使用时：
 * this.unit.timestampToTime(time)
 */

let timestampToTime = timestamp => { // 时间戳 => 年-月-日 时：分：秒
  let time = ''
  if (timestamp.length !== 13) {
    time = timestamp * 1000
  }
  let date = new Date(time * 1)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  let h = date.getHours()
  let min = date.getMinutes()
  let s = date.getSeconds()
  let two = num => {
    if (num < 10) {
      num = '0' + num
    }
    return num
  }
  return `${y}-${two(m)}-${two(d)} ${two(h)}:${two(min)}:${two(s)}`
}

export default {
  timestampToTime
}