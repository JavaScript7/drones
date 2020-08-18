const api = { // (错误：'​/api/)
  // 团队接口
  addDrone: '/api/add_drone', // 团队添加无人机√
  deleteDrone: '/api/delete_drone', // 子账户删除无人机√
  addFlyer: '/api/add_flyer', // 团队添加飞手√
  changeTeamName: '/api/change_team_name', // 修改团队名字√
  teamflyers: '/api/teamflyers', // 查询团队旗下的飞手信息，团队信息(子账号使用)√
  // 子账户相关
  addTeam: '/api/add_team', // 子账户添加团队(manager_id： 2000，junior_manager_id：管理者id)
  team: '/api/teams', // 子账户下团队查询√
  flyers: '/api/flyers', // 查询子账户团队飞手√
  subAccountInfo: '/api/subaccountinfo', // 子账户获取信息(团队，飞手，无人机，操作权限)
  delTeam: '/api/delete_team', // 删除团队√
  updateFlyer: '/api/update_flyer', // 更新飞手个人信息
  delFlyer: '/api/delete_flyer', // 子账户删除飞手√
  // 登录退出
  login: '/api/login', // 用户登录√
  logout: '/api/logout', // 用户退出√
  // 操作日志
  logs: '/api/logs', // 获取操作日志×
  // 管理员
  managerInfo: '/api/manager_info', // 获取管理员的子账户，子账户团队信息，团队飞手信息√
  subusers: '/api/subusers', // 获取管理员的全部子账户√
  addSubaccount: '/api/add_subaccount', // 管理员增加子账户√
  delSubaccount: '/api/delete_subaccount', // 管理员删除子账户√
  allRoles: '/api/roles', // 获取全部角色√
  // deault
  fileapi: '/fileapi/file', // 图片下载(get)或者文件上传接口（put）
  ModifyPasswd: '/api/modify_pass', // 修改用户密码
  uploadPic: '/fileapi/upload_picture', // 图片上传
  taskFile: '/fileapi/taskfile_upload', // 任务文件上传
  // 任务
  taskTypes: '/api/task_types', // 获取全部任务类型√
  addTaskPic: '/api/add_task_pic', // 添加任务图片或者视频(type: 0是图片1是视频)
  addTask: '/api/add_task', // 管理员派发任务√
  tasks: '/api/tasks', // 管理员查询任务(limit: 10分页（num）offset：0数量（num）)（管理员√ 子账户×）
  finishTask: '/api/finish_task', // 完成任务
  searchTask: '/api/search_task', // 管理员搜索任务√(只能搜索name和开始时间与结束时间)(5全部0未完成（待确认）1已完成2已确认（进行中）)
  subSearchTask: '/api/sub_search_task', // 子账户搜索任务
  subaccountTask: '/api/subaccount_tasks', // 子账户查询任务
  getTaskUploadUrl: '/api/get_task_upload_url', // 获取任务上传地址
  // taskCount: '/api/tasks_count', // 查询管理员下发的任务总数√
  updateTaskStatus: '/api/update_task_status', // 更新任务状态
  delTask: '/api/delete_task', // 子账户或者管理员删除任务√
  // 权限
  permissions: '/api/permissions', // 获取全部权限操作类型√
  rolePermissions: '/api/role_permissions', // 获取角色的权限√
  // 辅助接口
  city: '/utils/city_district', // 获取某个市的所有区(class_id)√
  province: '/utils/province', // 获取全部省份及其代码√
  provinceCity: '/utils/province_city', // 获取某个指定省份下的所有市√
  updateFlyhand: '/api/updateFlyhand', // 飞手个人信息修改
  aliOssUrl: 'http://8.129.9.170:8972/', // 阿里云ali-oss服务端签名直传
  // oss   // http://10.0.1.146/flyer_6
  ossFileCreate: '/fileapi/createPath', // 新建用户数据文件目录
  ossFilePath: '/fileapi/paths', // 获取用户目录信息
  ossAuth: '/fileapi/ossauth', // 获取阿里云临时签名信息
  ossDelFile: '/fileapi/delete_path', // 删除文件
  ossPathFile: '/fileapi/path_file', // 获取目录下的所有文件，不包含子目录
  // 飞行日志
  delFlyLog: '/flyerapi/delete_fly_log', // 删除飞手日志
  flyStat: '/flyerapi/fly_stat', // 无人机统计数据
  searchFlyLog: '/flyerapi/search_flylogs', // 查询飞行日志
  logPos: '/flyerapi/log_pos', // 查询飞行记录的轨迹
  // 实时视频
  online: '/live/online', // 获取当前用户正在直播的飞手及url
  flyerOnline: '/live/online_flyer', // 获取当前用户在线的飞手
  recordEnd: '/live/record_end', // 停止录像
  recordStart: '/live/record_start', // 对正在直播的流进行录像
  // websocket
  websocketOnlineUrl: 'ws://8.129.9.170:5959/ws', // 线上websocket地址
  // websocketUrl: 'ws://8.129.9.170:5959/ws', // 本地websocket地址
  websocketUrl: 'wss://test.meiyafly.com/ws' // 线上websocket地址
}

export default api

/**
 * 分页
 * limit显示一页有多少条数（默认15条）
 * offset显示当前第几页（默认1）
 * total总计多少条数
 */
/*
console.log(window.location.hash.split('/')[1])
{
  "type":20004,
  "payload":{
    "flyhands":[],
    "subaccounts":{
      "1":"wefwefwef",
      "2":"测试",
      "3":"测试用户2"
    },
    "teams":{}
  },
  "status":0,
  "msg":"token认证成功"
}
{
  "type":10001,
  "payload":{
    "drone_id":123456,
    "flyer_id":123456,
    "latitude":112.12345131654445,纬度lat
    "longtitude":23.12312222222244,经度lng
    "height":10.0,
    "speed":3.5,
    "remote_signal":5.0,遥控信号
    "remote_charge":80.0,遥控电量
    "drone_charge":70.0,无人机电量
    "drone_voltage":12345.0,无人机电压
    "drone_current":2.5,电流
    "pitch":0.10000000149011612,俯仰角
    "roll":0.0,横滚角
    "yaw":0.0,航向角
    "distance":200.0,距离
    "picture_bandwidth":1.0,带宽
    "datarate":100.0速率
  }
}
// let subaccount = { // 子账号
//   name: 'testsub',
//   psw: '123456'
// }
// let parent = { // 管理员账号
//   name: 'test',
//   psw: '123456'
// }
console.log(this.$route.name)
console.log(window.location.hash.split('/')[1])

this.$axios.get('https://api.apiopen.top/videoRecommend',  {
  params: {
    id: '127398'
  }
}).then(res => {})

this.$axios.post(url, {
  id: '1431'
}).then(res => {})

// let datas = {
//   number: 1,
//   name: 'test'
// }
// this.$axios.post('/api', {
//   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
// }).then(res => {
//   console.log(res)
// })

let data = {
  name: ''
}
this.$axios.post(this.api.addlink, data, {
  params: this.params
}).then(res => {
  if (res.Status === 0) {
    console.log(res.Data)
  } else {
    this.$message.error(res.Msg)
  }
})

this.$axios({
  headers: {
    'Content-Type': 'application/json'
  },
  transformRequest: [function(data) {
    data = JSON.stringify(data)
    return data
  }],
  url: this.api.addSubaccount,
  method: 'post',
  data,
  params: this.params
}).then(res => {
  console.log(res)
})

this.$axios({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  transformRequest: [function(data) {
    data = Qs.stringify(data)
    return data
  }],
  url: this.api.addSubaccount,
  method: 'post',
  data,
  params: {
    id,
    token
  }
}).then(res => {
  console.log(res)
})

this.$forceUpdate() // 解决动态改变数据后渲染的很慢或者不渲染
npm cache clean --force


let data = {
  miles: {
    x: [2012-1, 2012-2],
    y: [0, 0]
  },
  fly_count: {
    x: [2012-1, 2012-2],
    y: [0, 0]
  },
  timelong: {
    x: [2012-1, 2012-2],
    y: [0, 0]
  },
}

watch: {
  $route (to, from) { // to到那个路由from从那个路由来
    // to.params.name
  }
}
*/