<template>
  <div class="interface">
    <div class="head clearfix">
      <div class="logo">
        <img src="../../static/img/logo.png" alt="">
        <div class="title">应急无人机数据管理平台</div>
      </div>
      <ul class="nav">
        <router-link
          v-for="e in navLi"
          :key="e.id"
          :to="e.path"
          tag="li"
          :class="activeName === e.path.substr(1) ? 'active' : ''"
          @click.native="activeLi = e.id"
        >{{e.name}}</router-link>
      </ul>
      <div class="acount">
        <div class="info">{{nickName}}</div>
        <div class="reset">
          <p @click="setVisible = !setVisible">设置</p>
          <ul :class="setVisible ? 'feature disblock' : 'feature disnone'">
            <li>密码更改</li>
            <li @click="loginOut">退出账号</li>
          </ul>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      setVisible: false,
      activeLi: 0,
      ws: null,
      timer: null,
      subaccounts: [],
      droneInfo: [],
      allFlyers: [] // 所有飞手
    }
  },
  created () {
    this.loginReload()
    this.getAllFlyers()
  },
  computed: {
    manager () { // 管理者显示添加账户非管理者隐藏添加账户
      return this.$store.state.userInfo.type === 'manager' ? true : false
    },
    navLi () {
      // if (this.manager) {
        return [
          {id: 0, path: '/home', name: '首页'},
          {id: 1, path: '/inspection', name: '实时巡查'},
          {id: 3, path: '/review', name: '任务中心'},
          {id: 4, path: '/picture', name: '数据中心'},
          {id: 5, path: '/memberManage', name: '团队管理'},
          {id: 6, path: '/record', name: '操作记录'}
        ]
      // } else {
      //   return [
      //     {id: 0, path: '/home', name: '首页'},
      //     {id: 1, path: '/inspection', name: '实时巡查'},
      //     {id: 3, path: '/review', name: '任务中心'},
      //     {id: 4, path: '/picture', name: '数据中心'},
      //     {id: 5, path: '/memberManage', name: '团队管理'}
      //   ]
      // }
    },
    activeName () {
      switch (this.$route.name) {
        case 'home':
          return 'home'
          break
        case 'inspection':
          return 'inspection'
          break
        case 'review':
        case 'distribute':
          return 'review'
          break
        case 'teamManage':
        case 'memberManage':
        case 'deviceDetail':
        case 'authManage':
          return 'memberManage'
          break
        case 'record':
          return 'record'
          break
        default:
          return 'picture'
          break
      }
    },
    nickName () {
      return this.$store.state.userInfo.Nickname || this.$store.state.userInfo.Name
    },
    params () {
      return {
        id: this.$store.state.userInfo.ID,
        token: this.$store.state.userInfo.SocketToken
      }
    }
  },
  mounted () {
    this.websocketInit()
    // this.sendDatas() // 假数据
  },
  methods: {
    getAllFlyers () {
      let url = this.manager ? this.api.managerInfo : this.api.subAccountInfo
      this.$axios.get(url, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.allFlyers = res.Data.flyers
        }
      })
    },
    loginReload () { // 登录后进行刷新一次
      if (location.href.indexOf("#reloaded")==-1) {
        location.href=location.href+"#reloaded"
        location.reload()
      }
    },
    websocketInit () {
      if ("WebSocket" in window) {
        this.ws = new WebSocket(this.api.websocketUrl)
        // this.ws = new WebSocket('ws://127.0.0.1:3000')
        this.ws.onopen = () => {
          this.sendHeartBeat()
          let obj = {
            type: 10004,
            payload: {
              id: this.$store.state.userInfo.ID,
              token: this.$store.state.userInfo.SocketToken 
            }
          }
          this.ws.send(JSON.stringify(obj))
        }
        this.ws.onmessage = evt => {
          this.OnMessage(JSON.parse(evt.data))
          // console.log(evt.data)
        }
        this.ws.onclose = () => {
          this.droneInfo = []
          this.$bus.$emit('begin', this.droneInfo)
          this.$message.error('数据链接已掉线，请刷新下网页！')
        }
        this.ws.onerror = evt => {
          console.log(evt)
        }
      } else {
        alert("您的浏览器不支持 WebSocket!")
      }
    },
    sendHeartBeat () { // websocket心跳检测
      if (this.ws.readyState === 1) {
        let curTime = Date.parse(new Date()) / 1000
        let heart = {
          type: 10002,
          time: curTime
        }
        this.timer = setInterval(() => {
          this.ws.send(JSON.stringify(heart))
        }, 4000)
      }
      this.$once('hook:beforeDestroy', () => { // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
        clearInterval(this.timer)
      })
    },
    OnMessage (data) {
      // console.log(data) // {flyer_id: 3, latitude: 0, longtitude: 0, speed: 0, remote_signal: 0, …}
      // sessionStorage.removeItem('droneInfo')
      if (data.type === 20004) {
        sessionStorage.removeItem('droneInfo')
        this.$bus.$emit('beginToken')
      }
      if (data.type === 30002) { // 飞手下线
        // console.log('飞手下线id:' + data.payload.flyer_id)
        this.droneInfo.forEach((e, i) => {
          if (e.flyer_id === data.payload.flyer_id) {
            this.droneInfo.splice(i, 1)
          }
        })
        this.$bus.$emit('begin', this.droneInfo)
      }
      if (data.type === 30004) { // 直播上线 // {"type":30004,"payload":{"flyer_id":3}}
        let flyerName = ''
        this.allFlyers.forEach(e => {
          if (e.id === data.payload.id) {
            flyerName = e.nickname
          }
        })
        this.$message.success('飞手 '+flyerName+' 直播上线')
        this.$bus.$emit('liveOnline', {id: data.payload.id, name: flyerName}) // {"type":30004,"payload":{"id":16}}
      }
      if (data.type === 30005) { // 直播下线
        let flyerName = ''
        this.allFlyers.forEach(e => {
          if (e.id === data.payload.id) {
            flyerName = e.nickname
          }
        })
        this.$message.success('飞手 '+flyerName+' 直播下线')
        this.$bus.$emit('liveOffine', {id: data.payload.id, name: flyerName})
      }
      if (data.type === 30006) {
        // {"type":30006,"payload":{"drone_id":25,"drone_name":"精灵2","drone_sn":"","id":3,"manager":"管理者","manager_id":100001,"subaccount_id":200001,"subaccount_name":"测试"}}
      }
      if (data.flyer_id) {
        // this.droneInfo = []
        //  {flyer_id: 1, latitude: 0}
        //  {flyer_id: 2, latitude: 0}
        // [{flyer_id: 1, latitude: 10}, {flyer_id: 2, latitude: 10}]
        let flag = true
        if (this.droneInfo.length === 0) {
          this.droneInfo.push(data)
        }
        this.droneInfo.forEach((e, i) => { // [{flyer_id: 1, latitude: 10}] // 1
          if (e.flyer_id === data.flyer_id) { // [{flyer_id: 1, latitude: 10}, {flyer_id: 2, latitude: 10}] // 2
            e.longtitude = data.longtitude
            e.latitude = data.latitude
            e.speed = data.speed
            e.height = data.height
            e.pitch = data.pitch
            e.roll = data.roll
            e.yaw = data.yaw
            e.remote_signal = data.remote_signal
            e.remote_charge = data.remote_charge
            e.drone_charge = data.drone_charge
            e.drone_voltage = data.drone_voltage
            e.drone_current = data.drone_current
            e.picture_bandwidth = data.picture_bandwidth
            flag = false
          }
        })
        if (flag) {
          this.droneInfo.push(data)
        }
        let obj = {}
        let deWeightFour = arr => {
          arr = arr.reduce(function(a, b) {
            obj[b.drone_id] ? '' : obj[b.drone_id] = true && a.push(b)
            return a
          }, [])
          return arr
        }
        // sessionStorage.removeItem('droneInfo')
        // this.droneInfo.push(data)
        // this.droneInfo = deWeightFour(this.droneInfo)
        // console.log(this.droneInfo)
        // sessionStorage.setItem('droneInfo', JSON.stringify(this.droneInfo))
        this.$bus.$emit('begin', this.droneInfo)
      }
      // if (data.type === 10001) { // 无人机信息
      //   // this.droneInfo = []
      //   this.droneInfo.push(res)
      //   sessionStorage.setItem('droneInfo', JSON.stringify(this.droneInfo))
      // } else {
      //   let subs = res.subaccounts
      //   this.subaccounts = []
      //   for (let i in subs) {
      //     this.subaccounts.push(subs[i])
      //   }
      //   sessionStorage.setItem('subaccounts', this.subaccounts)
      // }
    },
    sendDatas () {
      // let res = {
      //   latitude: 118.116646,
      //   longtitude: 24.471346,
      // }
      let res = {
        drone_charge: 43,
        drone_current: -1346,
        drone_id: '163cg',
        drone_name: 'Mavic',
        drone_temperature: 29.7,
        drone_voltage: 15221,
        flyer_id: 3,
        latitude: 24.469330762325056,
        longtitude: 118.10946139666437,
        picture_bandwidth: 0,
        picture_qos: 0,
        picture_signal: 0,
        pitch: 3,
        remote_charge: 73,
        remote_signal: 5,
        roll: 1.9,
        speed: -1.7,
        team_name: '用户1无人机团队',
        yaw: 42.8
      }
      this.droneInfo.push(res)
      sessionStorage.setItem('droneInfo', JSON.stringify(this.droneInfo))
    },
    sendDataType (data) {
      this.ws.send(JSON.stringify(data))
    },
    // getAllRoles () {
    //   this.$axios.get(this.api.allRoles, {
    //     params
    //   })
    // },
    loginOut () {
      this.$axios.get(this.api.logout,  {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          // this.$store.commit('LOGIN_OUT')
          sessionStorage.removeItem('subaccounts')
          sessionStorage.removeItem('droneInfo')
          this.$router.push('login')
        } else if (res.Msg === '认证失败，权限错误') {
          this.$router.push({path: 'login'})
        }
      })
    },
    getCookie (name) {
      let cookieValue = null
      if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim()
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
            break
          }
        }
      }
      return cookieValue
    }
  }
}
</script>

<style lang="scss" scoped>
.interface{
  width: 100%;
  min-width: 1400px;
  overflow-y: hidden;
}
.head{
  height: 80px;
  background-color: #000;
  .logo{
    float: left;
    img{
      width: 56px;
      height: 74px;
      margin-left: 20px;
      vertical-align: middle;
    }
    .title{
      display: inline-block;
      line-height: 80px;
      font-size: 20px;
      color: #E4BF71;
      font-weight: 700;
    }
  }
  .nav{
    float: left;
    height: 100%;
    margin-left: 40px;
    .active{
      color: #E4BF71;
    }
    li{
      float: left;
      height: 100%;
      margin: 0 16px;
      line-height: 80px;
      font-size: 20px;
      color: #fff;
      font-weight: 700;
      &:hover{
        cursor: pointer;
        color:#E4BF71;
      }
    }
  }
  .acount{
    position: relative;
    float: right;
    height: 100%;
    margin-right: 120px;
    line-height: 80px;
    font-size: 0;
    text-align: center;
    z-index: 9999;
    .info{
      display: inline-block;
      margin-right: 20px;
      font-size: 20px;
      color: #E4BF71;
    }
    .reset{
      position: relative;
      display: inline-block;
      width: 100px;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      color: #fff;
      border-radius: 10px;
      background-color: #169BD5;
      cursor: pointer;
      .feature{
        position: absolute;
        top: 40px;
        left: 0px;
        width: 100px;
        font-size: 16px;
        color: #000;
        border: 1px solid #000;
        background-color: #fff;
        z-index: 999;
        li:first-child{
          border-bottom: 1px solid #000;
        }
        li:hover{
          cursor: pointer;
        }
      }
    }
  }
}
</style>
