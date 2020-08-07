{
  // const arr = [9, 2, 6]
  // console.log(Math.max(arr)) // NaN  Math.max(x)的参数是Number类型，可以使小数，整数，正数，负数或者是0.如果不是上面所述类型就会返回NaN.
  // console.log(Math.max(arr[0], arr[1], arr[2])) // 9
  // console.log(Math.max.call(Math, arr[0], arr[1], arr[2])) // 9  A.call(B, x, y)：就是把A的函数放到B中运行，x 和 y 是A方法的参数
  // console.log(Math.max.apply(Math, arr)) // 9
}{
  // let arr = [1, 2]
  // let num = [1, 2]
  // console.log(arr == num) // false
  // console.log(JSON.stringify(arr) === JSON.stringify(num)) // true
}{
  /*
    this.$axios.post(this.api.login, data).then(res => {})
  */
  let flyers = {
    '2': {id: 1, name: '小明', teamId: 12},
    '1': {id: 2, name: '张三', teamId: 11},
    '3': {id: 3, name: '李四', teamId: 11}
  }
  let team = [
    {id: 11, flyers: '[1, 3]', flyer: []},
    {id: 12, flyers: '[2]', flyer: []},
    {id: 13, flyers: '', flyer: []}
  ]
  let data = []
  for (let i in flyers) {
    data.push(flyers[i])
  }
  data.forEach(e => {
    team.forEach(item => {
      if (e.teamId === item.id) {
        item.flyer.push(e)
      }
    })
  })
  // team.forEach(e => {
  //   if (e.flyers) {
  //     for (let item of e.flyers) {
  //       console.log(item)
  //     }
  //   }
  // })
}{
  // let getSuffix = fileName => {
  //   var pos = fileName.lastIndexOf(".")
  //   var suffix = ''
  //   if (pos != -1) {
  //     suffix = fileName.substring(pos)
  //   }
  //   return suffix
  // }
}{
  let fid = 11
  let teams = [
    {id: 1, name: 'a', flyers: '[4,6,7]'},
    {id: 2, name: 'b', flyers: '[8]'},
    {id: 3, name: 'c', flyers: '[10]'}
  ]
  let findName = fid => {
    let val = ''
    teams.forEach(e => {
      let arr = []
      arr = (e.flyers.replace(/(\[)|(\])/g, '')).split(',')
      arr.forEach(item => {
        console.log(item)
        if (item*1 === fid) {
          val = e.name
        }
      })
    })
    return val
  }
  // console.log(findName(fid))
  // let arr = []
  // let flyers = '[4,6,7]'
  // let y = flyers.replace(/(\[)|(\])/g, '')
  // y.split(',').forEach(e => {
  //   console.log(e)
  // })
}{
  let arr = '[3,2]'
  let arrs = (arr.replace(/(\[)|(\])/g, '')).split(',').length
}{
  let accounts = [
    {id: 1, name: '账号1', teams: '[1]', team: []},
    {id: 2, name: '账号2', teams: '[6,7]', team: []},
    {id: 3, name: '账号3', teams: '[]', team: []}
  ]
  let teams = [
    {id: 1, name: '团队1', manageId: 1, flyers: '[9,10]'},
    {id: 6, name: '团队1', manageId: 2, flyers: '[11,6]'},
    {id: 7, name: '团队1', manageId: 2, flyers: ''}
  ]
  let flyers = [
    {id: 9, belongteam_id: 1, name: '张三', belong_user_id: 1},
    {id: 10, belongteam_id: 1, name: '李四', belong_user_id: 1},
    {id: 11, belongteam_id: 6, name: '王五', belong_user_id: 2},
    {id: 6, belongteam_id: 6, name: '赵六', belong_user_id: 2}
  ]
  teams.forEach(e => e.flyer = [])
  accounts.forEach(e => e.team = [])
  teams.forEach(e => {
    (e.flyers.replace(/(\[)|(\])/g, '')).split(',').forEach(item => {
      flyers.forEach(flyer => {
        if (item*1 === flyer.id) {
          e.flyer.push(flyer)
        }
      })
    })
  })
  accounts.forEach(e => {
    (e.teams.replace(/(\[)|(\])/g, '')).split(',').forEach(item => {
      teams.forEach(team => {
        if (item*1 === team.id) {
          e.team.push(team)
        }
      })
    })
  })
  // console.log(accounts[0].team[0].flyer)
}{
  let arr = [
    {id: 1, area: 'a'},
    {id: 1, area: 'b'},
    {id: 3, area: 'a'}
  ]
  var obj = {}
  function deWeightFour(arr) {
    arr = arr.reduce(function(a, b) {
      obj[b.id] ? '' : obj[b.id] = true && a.push(b);
      return a
    }, [])
    return arr
  }
  var newArr4 = deWeightFour(arr)
  // console.log(newArr4)
}{
  let selectVal = ''
  let subaccounts = [
    {id: 1, area: 'a'},
    {id: 2, area: 'a'},
    {id: 3, area: 'b'},
  ]
  let arrs = []
  if (selectVal) {
    let arr = []
    subaccounts.forEach(e => {
      if (e.area === selectVal) {
        arr.push(e)
      }
    })
    subaccounts = arr
  } else {
    arrs = subaccounts
  }
  // console.log(subaccounts)
}{
  // let obj = {id: 0, name: 'a'}
  // let arr = [{id: 1, name: 'b'}, {id: 0, name: 'a'}]
  // if(JSON.stringify(arr).indexOf(JSON.stringify(obj)) === -1){
  //   arr.push(obj)
  // }
  // console.log(arr)

  // let flag = true;
  // dataArr.forEach(item=>{
  //   if(obj.sort===item.sort){	//对象里的唯一标识sort
  //     flag = false;
  //   }
  // })
  // if(flag){ 	// 如果满足当前添加的值在数组里不存在，就把值添加进去
  //   dataArr.push(obj);
  // }
}{
  let data = {
    type: 30002,
    payload: {
      flyer_id: 10
    }
  }
  let arr = [
    {flyer_id: 1, name: 'a'},
    {flyer_id: 10, name: 'b'},
  ]
  // {"type":30002,"payload":{"flyer_id":10}}
  arr.forEach((e, i) => {
    if (data.payload.flyer_id === e.flyer_id) {
      arr.splice(i, 1)
    }
  })
  // console.log(arr)
}{
  // let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
      // this.inlineDrones.forEach(item => {
      //   let marker = ''
      //   marker = new AMap.Marker({
      //     position: new AMap.LngLat(item.longtitude, item.latitude),
      //     map: this.map,
      //     clickable: true
      //     // offset: new AMap.Pixel(0, 0) // (40,62) => (-20, -62)
      //   })
      //   marker.content = `
      //     <div class="marker">
      //       <h3>飞行信息</h3>
      //       <div class="clearfix marbtom">
      //         <div class="disline gfl">经度：${item.longtitude.toFixed(8)}</div><div class="disline gfr">纬度：${item.latitude.toFixed(8)}</div>
      //         <div class="disline gfl">速度：${item.speed}m/s</div><div class="disline gfr">高度：${item.height}m</div>
      //         <div class="disline gfl">俯仰角：${item.pitch.toFixed(2)}°</div><div class="disline gfr">横滚角：${item.roll.toFixed(2)}°</div>
      //         <div class="disline gfl">航向角：${item.yaw.toFixed(2)}°</div><div class="disline gfr"></div>
      //       </div>
      //       <h3>遥控器</h3>
      //       <div class="clearfix marbtom">
      //         <div class="disline gfl">遥控器信号：${item.remote_signal}%</div><div class="disline gfr">遥控器电量：${item.remote_charge}%</div>
      //       </div>
      //       <h3>电池</h3>
      //       <div class="clearfix marbtom">
      //         <div class="disline gfl">飞机电量：${item.drone_charge}%</div><div class="disline gfr">电压：${item.drone_voltage}mv</div>
      //         <div class="disline gfl">电池流：${item.drone_current}mA</div><div class="disline gfr"></div>
      //       </div>
      //       <h3>图传</h3>
      //       <div class="clearfix marbtom">
      //         <div class="disline gfl">图传信号：${item.picture_bandwidth}%</div>
      //       </div>
      //     </div>
      //   `
      //   marker.on('click', e => {
      //     this.isInfoWindow = !this.isInfoWindow
      //     if (this.isInfoWindow) {
      //       infoWindow.setContent(e.target.content)
      //       infoWindow.open(this.map, e.target.getPosition())
      //     } else {
      //       infoWindow.close()
      //     }
      //   })
      //   // this.markers.push(marker)
      // })
    // AMap.event.addDomListener(document.getElementById('delMarker'), 'click', () => {  
    //   this.map.remove(this.markers)
    // }, false)
    // this.$nextTick(() => {
      //   this.activeDroneInfo.drone_charge = this.inlineDrones[index].drone_charge
      //   this.activeDroneInfo.drone_current = this.inlineDrones[index].drone_current
      //   this.activeDroneInfo.drone_id = this.inlineDrones[index].drone_id
      //   this.activeDroneInfo.drone_name = this.inlineDrones[index].drone_name
      //   this.activeDroneInfo.drone_temperature = this.inlineDrones[index].drone_temperature
      //   this.activeDroneInfo.flyer_id = this.inlineDrones[index].flyer_id
      //   this.activeDroneInfo.height = this.inlineDrones[index].height
      //   this.activeDroneInfo.latitude = this.inlineDrones[index].latitude
      //   this.activeDroneInfo.longtitude = this.inlineDrones[index].longtitude
      //   this.activeDroneInfo.picture_bandwidth = this.inlineDrones[index].picture_bandwidth
      //   this.activeDroneInfo.picture_qos = this.inlineDrones[index].picture_qos
      //   this.activeDroneInfo.picture_signal = this.inlineDrones[index].picture_signal
      //   this.activeDroneInfo.pitch = this.inlineDrones[index].pitch
      //   this.activeDroneInfo.remote_charge = this.inlineDrones[index].remote_charge
      //   this.activeDroneInfo.remote_signal = this.inlineDrones[index].remote_signal
      //   this.activeDroneInfo.roll = this.inlineDrones[index].roll
      //   this.activeDroneInfo.show = this.inlineDrones[index].show
      //   this.activeDroneInfo.speed = this.inlineDrones[index].speed
      //   this.activeDroneInfo.team_name = this.inlineDrones[index].team_name
      //   this.activeDroneInfo.yaw = this.inlineDrones[index].yaw
      //   console.log(this.activeDroneInfo)
      // })
      // this.$nextTick(() => {
      //   this.activeDroneInfo.drone_charge = e.drone_charge
      //   this.activeDroneInfo.drone_current = e.drone_current
      //   this.activeDroneInfo.drone_id = e.drone_id
      //   this.activeDroneInfo.drone_name = e.drone_name
      //   this.activeDroneInfo.drone_temperature = e.drone_temperature
      //   this.activeDroneInfo.flyer_id = e.flyer_id
      //   this.activeDroneInfo.height = e.height
      //   this.activeDroneInfo.latitude = e.latitude
      //   this.activeDroneInfo.longtitude = e.longtitude
      //   this.activeDroneInfo.picture_bandwidth = e.picture_bandwidth
      //   this.activeDroneInfo.picture_qos = e.picture_qos
      //   this.activeDroneInfo.picture_signal = e.picture_signal
      //   this.activeDroneInfo.pitch = e.pitch
      //   this.activeDroneInfo.remote_charge = e.remote_charge
      //   this.activeDroneInfo.remote_signal = e.remote_signal
      //   this.activeDroneInfo.roll = e.roll
      //   this.activeDroneInfo.show = e.show
      //   this.activeDroneInfo.speed = e.speed
      //   this.activeDroneInfo.team_name = e.team_name
      //   this.activeDroneInfo.yaw = e.yaw
      //   console.log(this.activeDroneInfo)
      // })
      // marker.content = `
          // <div class="marker">
          //   <h3>飞行信息</h3>
          //   <div class="clearfix marbtom">
          //     <div class="disline gfl">经度：${this.inlineDrones[i].longtitude.toFixed(8)}</div><div class="disline gfr">纬度：${this.inlineDrones[i].latitude.toFixed(8)}</div>
          //     <div class="disline gfl">速度：${this.inlineDrones[i].speed}m/s</div><div class="disline gfr">高度：${this.inlineDrones[i].height}m</div>
          //     <div class="disline gfl">俯仰角：${this.inlineDrones[i].pitch.toFixed(2)}°</div><div class="disline gfr">横滚角：${this.inlineDrones[i].roll.toFixed(2)}°</div>
          //     <div class="disline gfl">航向角：${this.inlineDrones[i].yaw.toFixed(2)}°</div><div class="disline gfr"></div>
          //   </div>
          //   <h3>遥控器</h3>
          //   <div class="clearfix marbtom">
          //     <div class="disline gfl">遥控器信号：${this.inlineDrones[i].remote_signal}%</div><div class="disline gfr">遥控器电量：${this.inlineDrones[i].remote_charge}%</div>
          //   </div>
          //   <h3>电池</h3>
          //   <div class="clearfix marbtom">
          //     <div class="disline gfl">飞机电量：${this.inlineDrones[i].drone_charge}%</div><div class="disline gfr">电压：${this.inlineDrones[i].drone_voltage}mv</div>
          //     <div class="disline gfl">电池流：${this.inlineDrones[i].drone_current}mA</div><div class="disline gfr"></div>
          //   </div>
          //   <h3>图传</h3>
          //   <div class="clearfix marbtom">
          //     <div class="gfl picture_bandwidth">图传信号：${this.inlineDrones[i].picture_bandwidth}</div>
          //   </div>
          // </div>
          // `
          // marker.on('click', e => {
          //   this.isInfoWindow = !this.isInfoWindow
          //   if (this.isInfoWindow) {
          //     this.infoWindow.setContent(e.target.content)
          //     this.infoWindow.open(this.map, e.target.getPosition())
          //   } else {
          //     this.infoWindow.close()
          //   }
          // })
}{
  let str = 'flyer_6'
  // console.log(str.substring(6))
}{
  let arr = [
    {id: 3}
  ]
  let accounts = [
    {id: 200001,
      team: [
        {id: 3, flyer: [{id: 1}, {id: 2}, {id: 3}]}
      ]
    }
  ]

  // let arr1 = [{id: 2}, {id: 3}]
  // let arr2 = arr1.filter(e => {
  //   return e.id === 2
  // })
  // console.log(arr2)
}{
  let src = 'rtmp://8.129.9.170:1935/live/flyer_3'
  console.log(src.substring(35))
  let data = 3
  let liveSources = [
    {src: 'rtmp://8.129.9.170:1935/live/flyer_45'},
    {src: 'rtmp://8.129.9.170:1935/live/flyer_16'},
    {src: 'rtmp://8.129.9.170:1935/live/flyer_3'}
  ]
  liveSources = liveSources.filter(e => {
    return e.src.substring(35)*1 !== data
    // if (e.src.substring(35)*1 !== data) {
    //   console.log(1)
    // }
  })
  // console.log(liveSources)
}{
  let arr = [
    {id: 1, path: "图片", parent: 0, user_id: 100001},
    {id: 3, path: "视频", parent: 0, user_id: 100001},
    {id: 4, path: "飞手1", parent: 1, user_id: 100001},
    {id: 5, path: "few", parent: 0, user_id: 100001},
    {id: 6, path: "2020-7-30 飞手1", parent: 1, user_id: 100001},
    {id: 7, path: "图片/2020-7-30 飞手1", parent: 1, user_id: 100001}
  ]
}