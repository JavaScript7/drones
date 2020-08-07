<template>
  <div>
    <div class="container">
      <div class="map" id="maps"></div>
      <div class="layer">
        <div class="layer-item">
          <button :class="activeMap ? 'btn active-map' : 'btn'" id="add-layer" @click="addSatelliteLayer">卫星图层</button>
          <button :class="activeMap ? 'btn' : 'btn active-map'" id="remove-layer" @click="removeSatelliteLayer">标准图层</button>
        </div>
      </div>
      <div class="manage" ref="manage">
        <div class="arrow" @click="showNav">
          <p v-if="isShow">&gt;</p>
          <p v-else>&lt;</p>
        </div>
        <div class="title">
          <h3>××市应急管理无人机综合数据平台</h3>
        </div>
        <div class="drone-manage">
          <div class="title">无人机管理</div>
          <el-row class="mb10" v-if="manager">
            <el-col :span="12">
              <el-select v-model="selectVal" size="small" clearable @change="getAreaSearchAccountInfo">
                <el-option
                  v-for="item in areas"
                  :key="item.id"
                  :label="item.area"
                  :value="item.area">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="search" v-if="manager">
            <el-col :span="12">
              <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="请输入关键字" size="small" clearable></el-input>
            </el-col>
            <el-col :span="12">
              <el-button size="small" @click="getAreaSearchAccountInfo">搜索</el-button>
              <el-button size="small">重置</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="subaccounts"
            border
            max-height="250"
            class="table"
            :row-style="{height: '26px'}"
            :cell-style="{padding: '0'}"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="账户"
              align="center">
            </el-table-column>
            <el-table-column
              label="无人机数量"
              align="center"
              width="116">
              <template slot-scope="scope">{{scope.row.drones | dronesNum}}</template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button @click="look(scope.$index, scope.row)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="inline">
            <div class="title">在线无人机</div>
            <ul>
              <li v-for="(e, i) in inlineDrones" :key="e.id" class="clearfix">
                <!-- <img :src="e.img" alt=""> -->
                <!-- <img src="../../static/img/u17.jpg" alt="" class="line"> -->
                <span class="line">{{i}}</span>
                <span class="line account-name txt-hide" title="无人机所属账户">{{e.flyer_id | flyerId(flyers)}}</span>
                <span class="line team-name txt-hide" title="无人机所属团队">{{e.flyer_id | teamId(teams)}}</span>
                <span :class="e.show ? 'active-posi line cursor' : 'line cursor'" @click="activePosition(e, i)">{{e.show ? '取消定位' : '定位'}}</span>
                <span class="line cursor" @click="lookDroneInfo(e, i)" title="查看无人机信息">查看</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <el-dialog
        :visible.sync="teamDialog"
        center
        :title="`账号名：${this.manager ? curSubaccounts.regname : ''}`"
        :show-close="false"
        @close="teamDialog = false"
        :close-on-click-modal="false"
        width="700px">
        <div class="contains">
          <ul class="tab clearfix">
            <li
              v-for="(tab, aindex) in tabs"
              :key="tab.id"
              @click="toggleTab(aindex, tab.view)"
              :class="{active:active === aindex}">
              {{tab.type}}
            </li>
          </ul>
          <div class="team tabs" v-show="active === 0">
            <div v-if="teamDialog">
              <div class="team-item" v-for="(item, tIndex) in subaccounts[curIndex].team" :key="item.id">
                <h3 class="team-title">团队名称：{{item.name}}</h3>
                <h3 class="team-member">团队成员：</h3>
                <ul class="member mb10">
                  <li v-for="(e, index) in item.flyer" :key="e.id">
                    <div>
                      <img src="../../static/img/u195.png" alt=""
                        @mouseover="showFlyerInfo(e, 1, index, tIndex)"
                        @mouseleave="showFlyerInfo(e, 0, index, tIndex)">
                    </div>
                    <span>{{e.nickname}}</span>
                    <ul class="pernson-info" v-show="e.show">
                      <li>姓名：{{curFlyer.nickname}}</li>
                      <li>电话：{{curFlyer.phone}}</li>
                      <li>身份证：{{curFlyer.shenfenzheng}}</li>
                      <li>年龄：{{curFlyer.year}}岁</li>
                      <li>无人机驾龄：{{curFlyer.fly_year}}年</li>
                      <li>
                        飞行执照：
                        <img :src="curFlyer.licence_img" alt="">
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="curTeamNum === 0">
              <p>暂无团队</p>
            </div>
            </div>
          <div class="device tabs" v-show="active !== 0">
            <div v-if="teamDialog && curDevice !== 0">
              <div v-for="item in subaccounts[curIndex].team" :key="item.id">
                <h3 class="team-title">团队名称：{{item.name}}</h3>
                <h3 class="team-member">团队无人机：</h3>
                <ul class="member mb10">
                  <li v-for="e in item.drone" :key="e.id">
                    <div><img src="" alt="" @mouseover="e.show = true" @mouseleave="e.show = false"></div>
                    <span>{{e.name}}</span>
                    <ul class="pernson-info" v-show="e.show">
                      <li>名称：{{e.name}}</li>
                      <li>型号：{{e.type}}</li>
                      <li>责任人：{{e.responsible}}</li>
                      <li>设备配件：{{e.fitting}}</li>
                      <li>设备价值：{{e.value}}</li>
                      <li>第三方责任险：{{e.liability}}</li>
                      <li>备注：{{e.remark}}</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="curDevice === 0">
              <p>暂无无人机设备</p>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="closeInfo">关  闭</el-button>
        </span>
      </el-dialog>
      <div class="drone-info" v-show="isShowDroneInfo">
        <h3>无人机名称<span class="close-info" @click="isShowDroneInfo = false">×</span></h3>
        <div class="clearfix marbtom">
          <div class="dislines gfl">{{activeDroneInfo.drone_name ? activeDroneInfo.drone_name : ''}}</div>
        </div>
        <h3>所属团队</h3>
        <div class="clearfix marbtom">
          <div class="dislines gfl">{{activeDroneInfo.team_name ? activeDroneInfo.team_name : ''}}</div>
        </div>
        <h3>飞行信息</h3>
        <div class="clearfix marbtom">
          <div class="dislines gfl">经度：{{activeDroneInfo.longtitude ? activeDroneInfo.longtitude.toFixed(8) : 0}}</div><div class="dislines gfr">纬度：{{activeDroneInfo.latitude ? activeDroneInfo.latitude.toFixed(8) : 0}}</div>
          <div class="dislines gfl">速度：{{activeDroneInfo.speed ? activeDroneInfo.speed : 0}}m/s</div><div class="dislines gfr">高度：{{activeDroneInfo.height ? activeDroneInfo.height : 0}}m</div>
          <div class="dislines gfl">俯仰角：{{activeDroneInfo.pitch ? activeDroneInfo.pitch.toFixed(2) : 0}}°</div><div class="dislines gfr">横滚角：{{activeDroneInfo.roll ? activeDroneInfo.roll.toFixed(2) : 0}}°</div>
          <div class="dislines gfl">航向角：{{activeDroneInfo.yaw ? activeDroneInfo.yaw.toFixed(2) : 0}}°</div><div class="dislines gfr"></div>
        </div>
        <h3>遥控器</h3>
        <div class="clearfix marbtom">
          <div class="dislines gfl">遥控器信号：{{activeDroneInfo.remote_signal ? activeDroneInfo.remote_signal : ''}}%</div><div class="dislines gfr">遥控器电量：{{activeDroneInfo.remote_charge ? activeDroneInfo.remote_charge : 0}}%</div>
        </div>
        <h3>电池</h3>
        <div class="clearfix marbtom">
          <div class="dislines gfl">飞机电量：{{activeDroneInfo.drone_charge ? activeDroneInfo.drone_charge : 0}}%</div><div class="dislines gfr">电压：{{activeDroneInfo.drone_voltage ? activeDroneInfo.drone_voltage : 0}}mv</div>
          <div class="dislines gfl">电池流：{{activeDroneInfo.drone_current ? activeDroneInfo.drone_current : 0}}mA</div><div class="dislines gfr"></div>
        </div>
        <h3>图传</h3>
        <div class="clearfix marbtom">
          <div class="gfl picture_bandwidth">图传信号：{{activeDroneInfo.picture_bandwidth ? activeDroneInfo.picture_bandwidth : 0}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeMap: false,
      active: 0,
      currentView: '团队',
      tabs: [
        {id: 0, type: '团 队', view: 'tab1'},
        {id: 1, type: '无 人 机', view: 'tab2'}
      ],
      managerInfo: [], // 管理员信息
      flyers: [], // 飞手信息
      teams: [], // 团队信息
      drones: [], // 无人机设备
      droneInfo: [], // 无人机信息
      subaccounts: [], // 子账户信息
      curSubaccounts: {},
      curIndex: '',
      curTeamNum: 0, // 当前团队数量
      curDevice: 0,
      curFlyer: {
        nickname: '',
        phone: '',
        shenfenzheng: '',
        year: '',
        fly_year: '',
        licence_img: ''
      },
      map: null,
      layer: false, // 卫星图层是否开启
      satelliteLayer: null,
      markers: [],
      isShow: true,
      selectVal: '',
      flag: true,
      keyword: '',
      areas: [],
      teamDialog: false,
      teamInfo: [],
      inlineDrones: [],
      inlineLists: [],
      showPosit: false, // 显示当前定位
      activeIndex: null,
      isInfoWindow: false, // 是否窗体显示无人机信息
      infoWindow: null,
      isShowDroneInfo: false, // 是否展示无人机信息
      activeDroneIndex: null, // 当前无人机序号
      activeDroneInfo: { // 当前无人机信息
        drone_charge: '', // 电池电量
        drone_current: '',
        drone_id: '', //
        drone_name: '', //
        drone_temperature: '',
        drone_voltage: '', // 电池电压
        flyer_id: '',
        height: '',
        latitude: '',
        longtitude: '',
        picture_bandwidth: '', //
        picture_qos: '',
        picture_signal: '',
        pitch: '',
        remote_charge: '',
        remote_signal: '',
        roll: '',
        show: false,
        speed: '',
        team_name: '', //
        yaw: ''
      }
    }
  },
  mounted () {
    this.getManagerInfo()
    this.mapInit()
    if (this.map) {
      this.$bus.$on('begin', data => {
        if (this.markers.length > 0) {
          this.map.remove(this.markers)
        }
        this.getDroneInfo(data)
        this.markerInit()
      })
    }
  },
  computed: {
    manager () { // 管理者显示添加账户非管理者隐藏添加账户
      return this.$store.state.userInfo.type === 'manager' ? true : false
    },
    params () {
      return {
        id: this.$store.state.userInfo.ID,
        token: this.$store.state.userInfo.SocketToken
      }
    }
  },
  methods: {
    getManagerInfo () { // 获取管理员信息（飞手）
      let url = this.manager ? this.api.managerInfo : this.api.subAccountInfo
      this.$axios.get(url, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          if (this.manager) {
            this.managerInfo = res.Data
            let flyers = res.Data.flyers
            this.flyers = []
            for (let i in flyers) {
              this.flyers.push(flyers[i])
            }
            this.flyers.forEach(e => e.show = false)
            let teams = res.Data.teams
            this.teams = []
            for (let i in teams) {
              this.teams.push(teams[i])
            }
            this.teams.forEach(e => e.flyer = [])
            this.teams.forEach(e => e.drone = [])
            let drones = res.Data.drones
            this.drones = []
            for (let i in teams) {
              this.drones.push(teams[i])
            }
            let subaccount = res.Data.subaccount
            this.subaccounts = []
            for (let i in subaccount) {
              this.subaccounts.push(subaccount[i])
            }
            this.subaccounts.forEach(e => e.team = [])
            this.getAccountArea()
          } else {
            console.log(res.Data)
          }
        }
      })
    },
    getAccountArea () { // 搜索地区
      this.subaccounts.forEach((e, index) => this.areas.push({id: e.id, area: e.area}))
      let obj = {}
      let deWeight = arr => {
        arr = arr.reduce((a, b) => {
          obj[b.area] ? '' : obj[b.area] = true && a.push(b)
          return a
        }, [])
        return arr
      }
      this.areas = deWeight(this.areas)
    },
    getAreaSearchAccountInfo () { // 根据地区搜索账户信息（团队，飞手，无人机）
      if (this.selectVal) {
        if (this.flag) {
          let arr = []
          this.subaccounts.forEach(e => {
            if (e.area === this.selectVal) {
              arr.push(e)
            }
          })
          this.subaccounts = arr
          this.flag = false
        } else {
          let arr = []
          this.getManagerInfo()
          this.subaccounts.forEach(e => {
            if (e.area === this.selectVal) {
              arr.push(e)
            }
          })
          this.subaccounts = arr
          this.flag = true
        }
      } else {
        this.getManagerInfo()
      }
    },
    getDroneInfo (data) {
      if (data.length > 0) {
        this.inlineDrones = []
        this.droneInfo = []
        data.forEach(e => this.droneInfo.push(e))
        this.droneInfo.forEach(e => {
          e.show = false
          this.inlineDrones.push(e)
        })
        if (this.activeDroneIndex === 0 || this.activeDroneIndex > 0) {
          this.curDroneInfo()
        }
        // this.markerInit() // 获取无人机信息后再出现标记
        // console.log(this.inlineDrones)
      } else if (data.length === 0) {
        this.droneInfo = []
        this.inlineDrones = []
        this.isShowDroneInfo = false
      }
    },
    mapInit () {
      this.map = new AMap.Map('maps', {
        // satellite: '',
        resizeEnable: true,
        mapStyle: 'https:amap://styles/1de318cbb8d12c02303a22c550b9ccc9',
        viewMode: '3D',
        features: ['bg', 'road'],
        pitch: 0,
        maxPitch: 40,
        zoom: 18,
        // center: ['118.1156', '24.4313'] // 经度越大越往右，纬度越大越往上['113.944', '22.5306']
      })
      this.satelliteLayer = new AMap.TileLayer.Satellite() // 卫星图层
      this.map.plugin(['AMap.ToolBar'], () => { // 地图放大缩小轮盘
        this.map.addControl(new AMap.ToolBar({
          position: 'LB'
        }))
      })
      let adcode = this.map.getAdcode()
      let center = this.map.getCenter()
      this.map.setCenter([center.lng, center.lat])
      this.markerInit()
      // this.map.setFitView()
    },
    markerInit () {
      let len = this.inlineDrones.length
      if (len > 0) {
        this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)})
        for (let i = 0, marker; i<len; i++) {
          marker = new AMap.Marker({
            map: this.map,
            position: [this.inlineDrones[i].longtitude, this.inlineDrones[i].latitude],
            offset: new AMap.Pixel(-13, -13),
            icon: new AMap.Icon({
              image: '../../static/img/uav26x26.png',
              imageSize: new AMap.Size(24, 28)
            })
          })
          this.markers.push(marker)
        }
      }
    },
    addSatelliteLayer () { // 添加卫星图层
      this.map.add(this.satelliteLayer)
      this.activeMap = true
    },
    removeSatelliteLayer () {
      this.map.remove(this.satelliteLayer)
      this.activeMap = false
    },
    showNav () {
      this.$refs.manage.style.right = this.isShow ? (-454 + 'px') : 0
      this.isShow = !this.isShow
    },
    activePosition (e, i) { // 定位某个无人机
      this.$forceUpdate() // 解决动态改变数据后渲染的很慢或者不渲染
      this.map.remove(this.markers)
      if (e.show) {
        this.inlineDrones.forEach(item => item.show = false)
        this.mapInit()
        this.map.setFitView()
        return false
      }
      this.inlineDrones.forEach(item => item.show = false)
      e.show = true
      let marker = ''
      marker = new AMap.Marker({
        position: new AMap.LngLat(e.longtitude, e.latitude),
        map: this.map,
        offset: new AMap.Pixel(-13, -13),
        icon: new AMap.Icon({
          image: '../../static/img/uav26x26.png',
          imageSize: new AMap.Size(24, 28)
        })
      })
      this.markers.push(marker)
      this.map.setFitView()
    },
    look (index, row) {
      this.teamDialog = true
      this.curSubaccounts = row
      this.teamInfo = []
      this.curIndex = index
      this.teams.forEach(e => e.flyer = [])
      this.teams.forEach(e => {
        (e.flyers.replace(/(\[)|(\])/g, '')).split(',').forEach(item => {
          this.flyers.forEach(flyer => {
            if (item*1 === flyer.id) {
              e.flyer.push(flyer)
            }
          })
        })
      })
      this.teams.forEach(e => e.drone = [])
      this.teams.forEach(e => {
        (e.drones.replace(/(\[)|(\])/g, '')).split(',').forEach(item => {
          this.drones.forEach(drone => {
            if (item*1 === drone.id) {
              e.drone.push(drone)
            }
          })
        })
      })
      this.subaccounts.forEach(e => e.team = [])
      this.subaccounts.forEach(e => {
        (e.teams.replace(/(\[)|(\])/g, '')).split(',').forEach(item => {
          this.teams.forEach(team => {
            if (item*1 === team.id) {
              e.team.push(team)
            }
          })
        })
      })
      if (this.subaccounts[this.curIndex].teams === '[]') {
        this.curTeamNum = 0
      } else {
        this.curTeamNum = (this.subaccounts[this.curIndex].teams.replace(/(\[)|(\])/g, '')).split(',').length
      }
      console.log(this.subaccounts)
      // if (this.subaccounts[this.curIndex].teams === '[]') {
      //   this.curDevice = 0
      // } else {
      //   this.curDevice = (this.subaccounts[this.curIndex].teams.replace(/(\[)|(\])/g, '')).split(',').length
      // }
      // console.log(this.subaccounts[this.curIndex])
      // console.log(this.subaccounts[this.curIndex])
    },
    toggleTab (index, item) {
      this.active = index
      this.currentView = item
    },
    showFlyerInfo (item, num, index, tIndex) { // 是否显示飞手信息(item是否显示，num移入1移出0，index当前飞手序号，tIndex当前团队序号)
      this.$forceUpdate() // 解决动态改变数据后渲染的很慢或者不渲染
      item.show = num === 0 ? false : true
      if (num === 1) {
        let flyer = this.subaccounts[this.curIndex].team[tIndex].flyer[index]
        this.curFlyer.nickname = flyer.nickname
        this.curFlyer.phone = flyer.phone
        this.curFlyer.shenfenzheng = flyer.shenfenzheng
        this.curFlyer.year = flyer.year
        this.curFlyer.fly_year = flyer.fly_year
        this.curFlyer.licence_img = flyer.licence_img
      } else {
        for (let key in this.curFlyer) {
          this.curFlyer[key] = ''
        }
      }
    },
    lookDroneInfo (e, index) { // 查看当前无人机信息展示
      this.isShowDroneInfo = !this.isShowDroneInfo
      if (this.isShowDroneInfo) {
        this.activeDroneIndex = index
        this.curDroneInfo()
      } else {
        this.activeDroneIndex = null
      }
    },
    curDroneInfo () { // 当前无人机信息
      this.$nextTick(() => {
        this.activeDroneInfo.drone_charge = this.inlineDrones[this.activeDroneIndex].drone_charge
        this.activeDroneInfo.drone_current = this.inlineDrones[this.activeDroneIndex].drone_current
        this.activeDroneInfo.drone_id = this.inlineDrones[this.activeDroneIndex].drone_id
        this.activeDroneInfo.drone_name = this.inlineDrones[this.activeDroneIndex].drone_name
        this.activeDroneInfo.drone_temperature = this.inlineDrones[this.activeDroneIndex].drone_temperature
        this.activeDroneInfo.flyer_id = this.inlineDrones[this.activeDroneIndex].flyer_id
        this.activeDroneInfo.height = this.inlineDrones[this.activeDroneIndex].height
        this.activeDroneInfo.latitude = this.inlineDrones[this.activeDroneIndex].latitude
        this.activeDroneInfo.longtitude = this.inlineDrones[this.activeDroneIndex].longtitude
        this.activeDroneInfo.picture_bandwidth = this.inlineDrones[this.activeDroneIndex].picture_bandwidth
        this.activeDroneInfo.picture_qos = this.inlineDrones[this.activeDroneIndex].picture_qos
        this.activeDroneInfo.picture_signal = this.inlineDrones[this.activeDroneIndex].picture_signal
        this.activeDroneInfo.pitch = this.inlineDrones[this.activeDroneIndex].pitch
        this.activeDroneInfo.remote_charge = this.inlineDrones[this.activeDroneIndex].remote_charge
        this.activeDroneInfo.remote_signal = this.inlineDrones[this.activeDroneIndex].remote_signal
        this.activeDroneInfo.roll = this.inlineDrones[this.activeDroneIndex].roll
        this.activeDroneInfo.show = this.inlineDrones[this.activeDroneIndex].show
        this.activeDroneInfo.speed = this.inlineDrones[this.activeDroneIndex].speed
        this.activeDroneInfo.team_name = this.inlineDrones[this.activeDroneIndex].team_name
        this.activeDroneInfo.yaw = this.inlineDrones[this.activeDroneIndex].yaw
        this.activeDroneInfo.drone_voltage = this.inlineDrones[this.activeDroneIndex].drone_voltage
      })
    },
    closeInfo () { // 关闭无人机信息展示
      this.teamDialog = false
      this.activeDroneIndex = null
    }
  },
  filters: {
    dronesNum (drone) { // 根据无人机信息显示无人机数量
      if (drone === '[]') return 0
      return (drone.replace(/(\[)|(\])/g, '')).split(',').length
    },
    flyerId (fid, flyers) { // 根据id显示飞手姓名
      let val = ''
      flyers.forEach(e => {
        if (e.id === fid) {
          val = e.nickname
        }
      })
      return val
    },
    // droneModel (model, drones) {}
    teamId (fid, teams) { // 根据id显示团队名称
      let findName = fid => {
        let val = ''
        teams.forEach(e => {
          let arr = []
          arr = (e.flyers.replace(/(\[)|(\])/g, '')).split(',')
          arr.forEach(item => {
            if (item*1 === fid) {
              val = e.name
            }
          })
        })
        return val
      }
      return findName(fid)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  position: relative;
  // overflow: hidden;
  .drone-info{
    position: absolute;
    top: 56px;
    left: 0;
    width: 320px;
    padding: 10px 10px;
    color: #F1E434;
    background: #5F6F8E;
    opacity: .8;
    .close-info{
      position: absolute;
      top: 0;
      right: 0;
      width: 26px;
      height: 26px;
      color: #fff;
      font-size: 30px;
      &:hover{
        cursor: pointer;
      }
    }
    h3{
      color: #25A5F7;
    }
    .dislines{
      display: inline-block;
      width: 50%;
    }
    .marbtom{
      margin-bottom: 8px;
    }
    .picture_bandwidth{
      width: 220px;
    }
  }
}
.map{
  width: 100%;
  height: 857px;
}
.layer{
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 18px;
  border-radius: 5px;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  .layer-item{
    .btn{
      padding: 4px 4px;
      color: #25A5F7;
      font-size: 16px;
      border-color: #25A5F7;
      border-radius: 10px;
      background: #fff;
      cursor: pointer;
    }
    .active-map{
      color: #E4BF71;
      border: 1px solid #E4BF71;
    }
  }
}
.manage{
  position: absolute;
  top: 30px;
  right: 0;
  padding: 24px 16px 16px;
  width: 420px;
  border: 1px solid #000;
  background-color: #fff;
  z-index: 999;
  .arrow{
    position: absolute;
    top: 260px;
    left: -19px;
    width: 18px;
    height: 88px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-color: #12B7FF;
    &:hover{
      cursor: pointer;
    }
    p{
      line-height: 88px;
      color: #fff;
      font-size: 18px;
      text-align: center;
    }
  }
  .title{
    font-size: 0;
    margin-bottom: 16px;
    h3{
      display: inline-block;
      text-align: center;
      line-height: 50px;
      font-size: 26px;
      text-align: center;
      color: #8080FF;
      font-weight: 700;
    }
  }
  .drone-manage{
    .title{
      height: 40px;
      line-height: 40px;
      font-size: 22px;
      color: #000;
      font-weight: 700;
      text-indent: 20px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background-color: #8080FF;
    }
    .search{
      margin-bottom: 16px;
    }
    .table{
      margin-bottom: 20px;
    }
    .inline{
      .title{
        margin-bottom: 0;
      }
      ul{
        height: 140px;
        padding: 10px;
        border: 1px solid #000;
        border-top: none;
        overflow-y: scroll;
        li{
          height: 26px;
          border: 1px solid #000;
          &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4){
            border-bottom: none;
          }
          &:last-child{
            border-bottom: 1px solid #000;
          }
          img{
            width: 24px;
            height: 24px;
            margin-left: 10px;
            vertical-align: middle;
          }
          span{
            margin-left: 10px;
            &:last-child{
              color: #12B7FF;
            }
          }
        }
      }
    }
  }
}
.text{
  font-size: 24px;
  color: #000;
  font-weight: 700;
}
.member{
  height: 140px;
  li{
    float: left;
    position: relative;
    width: 120px;
    height: 120px;
    text-align: center;
    &:hover{
      cursor: pointer;
    }
    div>img{
      display: inline-block;
      width: 90px;
      height: 90px;
      border-radius: 50%;
    }
    span{
      font-size: 16px;
      color: #000;
    }
  }
}
.device{
  height: 140px;
  li{
    float: left;
    position: relative;
    width: 120px;
    height: 120px;
    text-align: center;
    &:hover{
      cursor: pointer;
    }
    div>img{
      display: inline-block;
      width: 90px;
      height: 90px;
      border: 1px solid #000;
      border-radius: 50%;
    }
  }
}
// .contan{
//   // position: relative;
// }
.contains{
  .tab{
    li{
      float: left;
      width: 50%;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      // border: 1px solid #409eff;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background: #409eff;
      &:hover{
        cursor: pointer;
      }
    }
  }
  .tabs{
    padding: 10px;
    border: 1px solid #409eff;
    border-top: none;
    .team-item{
      margin-bottom: 10px;
    }
  }
  .team{
    .team-item{
      margin-bottom: 10px;
    }
  }
  h3{
    font-size: 18px;
  }
  .pernson-info{
    position: absolute;
    top: 42px;
    left: 58px;
    // top: -47px;
    // left: 106px;
    width: 218px;
    padding: 10px;
    border: 1px solid #409eff;
    background-color: #fff;
    z-index: 999999;
    li{
      width: 220px;
      height: 30px;
      text-align: left;
      &:nth-child(4){
        height: auto;
        margin-bottom: 10px;
      }
    }
  }
  .team-title{
    margin-bottom: 10px;
  }
  .team-member{
    margin-bottom: 10px;
  }
}
.inline{
  ul{
    li{
      font-size: 0;
      .line{
        // display: inline-block;
        // float: left;
        height: 28px;
        line-height: 28px;
        font-size: 16px;
      }
      .account-name{
        width: 90px;
      }
      .team-name{
        width: 130px;
      }
    }
  }
}
.active-posi{
  color: #e4bf71;
}
</style>
