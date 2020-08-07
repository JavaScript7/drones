<template>
  <div class="videos">
    <div class="inspection clearfix">
      <div class="nav-list">
        <div class="title">在线设备列表</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#555"
          text-color="#fff"
          active-text-color="#ffd04b"
          @open="handleOpen"
          @close="handleClose">
          <el-submenu
            v-for="(e, i) in accountInfos"
            :key="e.id"
            :index="`${i}`">
            <template slot="title">
              <span>{{e.name}}</span>
            </template>
            <el-menu-item-group
              v-for="item in e.team"
              :key="item.id">
              <!-- <template slot="title">{{item.name}}</template> -->
              <el-menu-item
                v-for="(flyer, index) in item.flyer"
                :key="flyer.id">
                <span @click="lookDroneInfo(flyer, index)">{{flyer.drone_name}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="contain clearfix">
        <div class="map-area">
          <div class="title">实时位置</div>
          <div class="map" id="maps"></div>
          <div class="layer">
            <div class="layer-item">
              <button class="btn" id="add-layer" @click="addSatelliteLayer">卫星图层</button>
              <button class="btn" id="remove-layer" @click="removeSatelliteLayer">标准图层</button>
            </div>
          </div>
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
        <div class="video-area">
          <div class="title">实时直播</div>
          <!-- <video id="my-player"
               class="video-js vjs-default-skin vjs-big-play-centered"
                 preload="auto"
                 autoplay
                 style="width: 100%;height: 100%;"
                 controls
                 data-setup='{"html5" : { "nativeTextTracks" : false }}'>
            <source src="videoSrc" type="rtmp/flv">"
          </video>width="750" height="350" -->
          <div class="video">
            <!-- <div class="no-live" v-if="!isLive">暂无直播画面</div> -->
            <ul class="clearfix">
              <!-- <li v-for="(e, i) in liveSources" :key="i" style="width: 402px;">
                <div class="video-title">
                  飞手:{{e.src.substring(35)}}
                  <span class="full-btn disinline iconfont icon-quanping" @click="onPlayerFullScreen(i, e)"></span>
                </div>
                <video-plyer :src="e.src" style="width: 402px; height: 302px;"></video-plyer>
              </li> -->
              <li style="width: 402px;">
                <div class="video-title">
                  <!-- 飞手:{{liveSources[0] ? (liveSources[0].src).substring(35) : ''}} -->
                  <span>飞手{{'' | findFlyer}}</span>
                  <span class="full-btn disinline iconfont icon-quanping" @click="onPlayerFullScreen(1, liveSources[0].src)"></span>
                </div>
                <video-plyer :src="liveSources[0] ? liveSources[0].src : 'rtmp://8.129.9.170:1935/live/flyer_16'" style="width: 402px; height: 302px;"></video-plyer>
                <!-- <video-plyer :src="'rtmp://8.129.9.170:1935/live/flyer_3'" style="width: 402px; height: 302px;"></video-plyer> -->
              </li>
              <li style="width: 402px;">
                <div class="video-title">
                  飞手:{{liveSources[1] ? (liveSources[1].src).substring(35) : ''}}
                  <span class="full-btn disinline iconfont icon-quanping" @click="onPlayerFullScreen(2, liveSources[1].src)"></span>
                </div>
                <video-plyer :src="liveSources[1] ? liveSources[1].src : 'rtmp://8.129.9.170:1935/live/flyer_16'" style="width: 402px; height: 302px;"></video-plyer>
                <!-- <video-plyer :src="'rtmp://8.129.9.170:1935/live/flyer_16'" style="width: 402px; height: 302px;"></video-plyer> -->
              </li>
              <li style="width: 402px;">
                <div class="video-title">
                  飞手:{{liveSources[2] ? (liveSources[2].src).substring(35) : ''}}
                  <span class="full-btn disinline iconfont icon-quanping" @click="onPlayerFullScreen(3, liveSources[2].src)"></span>
                </div>
                <video-plyer :src="liveSources[2] ? liveSources[2].src : 'rtmp://8.129.9.170:1935/live/flyer_16'" style="width: 402px; height: 302px;"></video-plyer>
                <!-- <video-plyer :src="'rtmp://8.129.9.170:1935/live/flyer_16'" style="width: 402px; height: 302px;"></video-plyer> -->
              </li>
              <li style="width: 402px;">
                <div class="video-title">
                  飞手:{{liveSources[3] ? (liveSources[3].src).substring(35) : ''}}
                  <span class="full-btn disinline iconfont icon-quanping" @click="onPlayerFullScreen(4, liveSources[3].src)"></span>
                </div>
                <video-plyer :src="liveSources[3] ? liveSources[3].src : 'rtmp://8.129.9.170:1935/live/flyer_16'" style="width: 402px; height: 302px;"></video-plyer>
                <!-- <video-plyer :src="'rtmp://8.129.9.170:1935/live/flyer_16'" style="width: 402px; height: 302px;"></video-plyer> -->
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
// import { videoPlayer } from 'vue-video-player'
// import 'videojs-flash'
// import * as videojs from 'video.js'
import videoPlyer from '../components/common/videoPlay'
import RecordRTC from 'recordrtc'
import html2canvas from 'html2canvas' // 截图
export default {
  components: {
    videoPlyer
  },
  data () {
    return {
      videoSrc: 'rtmp://test.meiyafly.com/live/123',
      videoUrl: '', // rtmp://10.0.1.146:1939/live/flyer_6
      droneInfo: [], // 在线无人机信息
      liveDrones: [], // 直播中的飞手
      onlineFlyers: [], // 在线飞手
      subaccounts: [], // 账号
      flyers: [], // 所有飞手
      teams: [],
      onlineAccount: [],
      accountInfos: [], // 账户信息（团队，飞手，无人机）
      onlines: [],
      map: null,
      layer: false, // 卫星图层是否开启
      satelliteLayer: null,
      marker: [],
      liveSources: [],
      // {src: 'rtmp://10.0.1.110:1935/live/110'},
      // {src: 'rtmp://58.200.131.2:1935/livetv/hunantv'},
      // {src: 'rtmp://10.0.1.110:1935/live/123'}
      sourcess: [
        'http://ga.xm.gov.cn/xmjx/ztgd/wldspd/202005/P020200508411020251876.mp4',
        'http://ga.xm.gov.cn/xmjx/ztgd/wldspd/202005/P020200508411020251876.mp4',
        'http://ga.xm.gov.cn/xmjx/ztgd/wldspd/202005/P020200508411020251876.mp4',
        'http://ga.xm.gov.cn/xmjx/ztgd/wldspd/202005/P020200508411020251876.mp4'
      ],
      sources: [],
      videoDialogVisible: false, // 控制弹出层
      events: ['fullscreenchange'],
      playerOptiones: {
        autoplay: true, //如果true,浏览器准备好时开始回放。
        controls: true,
				muted: false, // 默认情况下将会消除任何音频。
				preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
				language: 'zh-CN',
				aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        techOrder: ['flash', 'html5'],
        flash: {
          hls: { withCredentials: false },
          swf: '../../static/js/video-js.swf'
        },
        html5: { hls: { withCredentials: false } }
      },
      playerOptions: {
				playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        controls: true,
				muted: false, // 默认情况下将会消除任何音频。
				loop: false, // 导致视频一结束就重新开始。
				preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
				language: 'zh-CN',
				aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        techOrder: ['flash', 'html5'],
        flash: {
          hls: { withCredentials: false },
          swf: '../../static/js/video-js.swf'
        },
        html5: { hls: { withCredentials: false } },
        sources: [
          {
            type: 'flv/mp4',
            src: 'rtmp://10.0.1.110/live/110'
          }, {
            type: 'flv/mp4',
            src: 'rtmp://10.0.1.146:1939/live/flyer_7' // rtmp://10.0.1.146:1939/live/flyer_7
          }
        ],
				poster: '', //你的封面地址
				width: document.documentElement.clientWidth,
				notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
				controlBar: {
				  timeDivider: true,
				  durationDisplay: true,
				  remainingTimeDisplay: false,
				  fullscreenToggle: false //全屏按钮
				}
      },
      ws: null,
      video: null,
      isLive: true,
      activeVideoUrl: '', // 当前直播地址
      isVideoOpen: false,
      activeFlyer: '',
      fullPlayerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        controls: true,
				muted: false, // 默认情况下将会消除任何音频。
				loop: false, // 导致视频一结束就重新开始。
				preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
				language: 'zh-CN',
				aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        techOrder: ['flash', 'html5'],
        flash: {
          hls: { withCredentials: false },
          swf: '../../static/js/video-js.swf'
        },
        html5: { hls: { withCredentials: false } },
        sources: [],
				poster: '', //你的封面地址
				width: document.documentElement.clientWidth,
				notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
				controlBar: {
				  timeDivider: true,
				  durationDisplay: true,
				  remainingTimeDisplay: false,
				  fullscreenToggle: false //全屏按钮
				}
      },
      isRecording: false, // 是否录像
      recorder: '',
      fullscreen: false,
      screenName: '', // 截图名字
      imgUrl: '',
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
      },
      inlineDrones: [],
      markers: []
      // data: [{
      //   flyer_id: 3, team_name: '团队1', drone_name: '精灵4', drone_current: 10, drone_id: 12, drone_temperature: 11, drone_charge: 4,
      //   height: 45, latitude: 24.469330762325056, longtitude: 118.10946139666437, picture_bandwidth: 54, picture_qos: 45, picture_signal: 465, pitch: 465,
      //   remote_charge: 54, remote_signal: 46, roll: 45, show: false, speed: 45, yaw: 754, drone_voltage: 45
      // }]
    }
  },
  created () {
    this.$nextTick(() => {
      this.initSources()
    })
  },
  mounted () {
    this.mapInit()
    this.$bus.$on('begin', data => {
      if (this.markers.length > 0) {
        this.map.remove(this.markers)
      }
      this.droneInfo = []
      this.initData(data)
      this.getDroneInfo(data)
      this.markerInit()
    })
    this.getActiveLive()
    this.$bus.$on('liveOnline', data => { // 直播上线 {"type":30004,"payload":{"flyer_id":3}}
      this.$forceUpdate()
      let arr = []
      arr.push({src: 'rtmp://8.129.9.170:1935/live/flyer_' + data.id})
      let obj = {}
      let deWeightFour = arr => {
        arr = arr.reduce(function(a, b) {
          obj[b.src] ? '' : obj[b.src] = true && a.push(b)
          return a
        }, [])
        return arr
      }
      this.liveSources = deWeightFour(arr)
      if (this.liveSources.length !== 0) {
        this.isLive = true
      } else {
        this.isLive = false
      }
      // console.log('直播上线')
      console.log(this.liveSources)
    })
    this.$bus.$on('liveOffine', data => { // 直播下线
      this.$forceUpdate()
      this.$nextTick(() => {
        this.liveSources = this.liveSources.filter(e => {
          return e.src.substring(35)*1 !== data.id
        })
        if (this.liveSources.length !== 0) {
          this.isLive = true
        } else {
          this.isLive = false
        }
        // console.log('直播下线')
        // console.log(this.liveSources)
      })
    })
    // this.initSources()
    // this.getLiveDrones()
    this.getAccountInfo()
    // this.getDroneInfo(this.data)
    // console.log(this.liveSources)
  },
  watch: {},
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
    initData (data) {
      this.subaccounts.forEach(e => e.team = [])
      this.subaccounts.forEach(e => { // 账户添加团队
        (e.teams.replace(/(\[)|(\])/g, '')).split(',').forEach(item => {
          this.teams.forEach(team => {
            if (team.id === item*1) {
              e.team.push(team)
            }
          })
        })
      })
      this.subaccounts.forEach(e => {
        e.team.forEach(item => item.flyer = [])
      })
      this.droneInfo = data
      this.subaccounts.forEach(e => { // 团队添加飞手
        e.team.forEach(team => {
          (team.flyers.replace(/(\[)|(\])/g, '')).split(',').forEach(item => {
            this.droneInfo.forEach(flyer => {
              if (flyer.flyer_id === item*1) {
                team.flyer.push(flyer)
              }
            })
          })
        })
      })
      // console.log(this.subaccounts)
      let obj = []
      this.subaccounts.forEach(item => {
        item.team.forEach(team => {
          team.flyer.forEach(flyer => {
            if (flyer.length !== 0) {
              obj.push(item)
            }
          })
        })
      })
      // console.log(this.subaccounts)
      let deWeightFour = arr => {
        arr = arr.reduce(function(a, b) {
          obj[b.id] ? '' : obj[b.id] = true && a.push(b);
          return a
        }, [])
        return arr
      }
      this.accountInfos = deWeightFour(obj)
      // console.log(this.accountInfos)
    },
    getAccountInfo () {
      let url = this.manager ? this.api.managerInfo : this.api.subAccountInfo
      this.$axios.get(url, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.flyers = res.Data.flyers
          sessionStorage.setItem('allflyers', JSON.stringify(this.flyers))
          this.teams = res.Data.teams
          if (this.manager) {
            this.subaccounts = res.Data.subaccount
          }
        }
      })
    },
    getLiveDrones () { // 飞手在线
      this.$axios.get(this.api.flyerOnline, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.onlineFlyers = res.Data
          this.accountInfos.forEach(e => {
            e.team.forEach(item => {
              (item.flyers.replace(/(\[)|(\])/g, '')).split(',').forEach(fly => {
                res.Data.forEach(name => {
                  if (fly*1 === name.id) {
                    item.flyer.push(name)
                  }
                })
              })
            })
          })
          // console.log(this.accountInfos)
          this.accountInfos.forEach((e, i, arr) => {
            e.team.forEach(item => {
              if (item.flyer.length === 0) {
                console.log(item)
                // arr.splice(i, 1)
              }
            })
          })
          // console.log(this.accountInfos)
        }
      })
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
      } else if (data.length === 0) {
        this.droneInfo = []
        this.inlineDrones = []
        this.isShowDroneInfo = false
      }
      // console.log(this.inlineDrones)
      this.markerInit()
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
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    initSources () {
      this.sources = [
        {url: 'rtmp://8.129.9.170/live/123'},
        {url: 'rtmp://8.129.9.170/live/123'}
      ]
      this.sources.forEach(e => {
        this.playerOptions.sources.push({
          type: 'flv/mp4',
          src: e.url
        })
      })
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
        zoom: 13,
        center: ['118.1156', '24.4313'] // 经度越大越往右，纬度越大越往上['113.944', '22.5306']
      })
      this.satelliteLayer = new AMap.TileLayer.Satellite() // 卫星图层
      this.map.plugin(['AMap.ToolBar'], () => { // 地图放大缩小轮盘
        this.map.addControl(new AMap.ToolBar({
          position: 'RT'
        }))
      })
      this.markerInit()
    },
    markerInit () {
      let len = this.inlineDrones.length
      if (len > 0) {
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
    addSatelliteLayer () {
      this.map.add(this.satelliteLayer)
    },
    removeSatelliteLayer () {
      this.map.remove(this.satelliteLayer)
    },
    getActiveLive () { // 获取当前用户正在直播的飞手及url
      this.$axios.get(this.api.online, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) { // e.substring(6)
          // this.videoUrl = 'rtmp://10.0.1.146:1939/live/' + res.Data[0]  // ["flyer_16"]
          this.liveSources = []
          if (res.Data.length === 0) {
            this.isLive = false
            return false
          }
          if (res.Data.length !== 0) {
            this.isLive = true
            this.$forceUpdate()
            res.Data.forEach(e => {
              this.liveSources.push({
                src: 'rtmp://8.129.9.170:1935/live/' + e // flyer_6 // flyer_3
              })
            })
          }
          // console.log(this.liveSources)
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    onPlayerFullScreen (index, e) {
      let {href} = this.$router.resolve({
        name: 'live',
        params: {
          src: this.liveSources[index].src
        }
      })
      window.open(href, '_blank')
      // this.isVideoOpen = true
      // this.$nextTick(() => {
      //   this.fullPlayerOptions.sources.push({
      //     type: 'video/mp4',
      //     src: this.sources[index]
      //   })
      // })
    },
    videoInit () {
      let time = this.$refs.videoPlayer1.player.currentTime() //已播放时长
    },
    flashChecker () {
      var hasFlash = 0;         //是否安装了flash
      var flashVersion = 0; //flash版本
      var isIE = /*@cc_on!@*/0;      //是否IE浏览器
      if (isIE) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
          hasFlash = 1;
          VSwf = swf.GetVariable("$version");
          flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
      } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
          var swf = navigator.plugins["Shockwave Flash"];
          if (swf) {
            hasFlash = 1;
            var words = swf.description.split(" ");
            for (var i = 0; i < words.length; ++i) {
              if (isNaN(parseInt(words[i]))) continue;
              flashVersion = parseInt(words[i]);
            }
          }
        }
      }
      return {f: hasFlash, v: flashVersion};
    },
    startRecording () { // 开始录像
      this.video = this.$refs.videoArea
      if (this.isRecording) {
        this.stopRecording()
      } else {
        this.captureScreen(screen=>{
          this.video.srcObject = screen
          this.recorder = RecordRTC(screen, {
            type: 'video',
            mimeType: 'video / webm; codecs = h264',
          })
          this.recorder.startRecording()
          this.recorder.screen = screen
          this.isRecording = true
        })
      }
    },
    captureScreen (callback) {
      this.invokeGetDisplayMedia((screen) => {
        // this.addStreamStopListener(screen, () => {})
        callback(screen)
      }, function (error) {
      })
      // navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(camera) {
      //   callback(camera)
      // }).catch((error) => {
      //   this.$message.error('未找到视频设备')
      // })
    },
    invokeGetDisplayMedia (success, error) {
      let displaymediastreamconstraints = {
        video: {
          displaySurface: 'monitor', // monitor, window, application, browser
          logicalSurface: true,
          cursor: 'always' // never, always, motion
        }
      }
      displaymediastreamconstraints = {
        video: this.$refs.videoArea
      }
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      } else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      }
    },
    addStreamStopListener (stream, callback) {
      stream.addEventListener('ended', function () {
        callback()
        callback = function () { }
      }, false)
      stream.addEventListener('inactive', function () {
        callback()
        callback = function () { }
      }, false)
      stream.getTracks().forEach(function (track) {
        track.addEventListener('ended', function () {
          callback()
          callback = function () { }
        }, false)
        track.addEventListener('inactive', function () {
          callback()
          callback = function () { }
        }, false)
      })
    },
    stopRecording () { // 停止录像
      // this.isRecording = false
      this.recorder.stopRecording(this.stopRecordingCallback)
    },
    stopRecordingCallback () { // 下载录像
      let video = this.$refs.videoArea
      video.src = video.srcObject = null
      video.src = URL.createObjectURL(this.recorder.getBlob())
      console.log(video.src)
      let downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(this.recorder.getBlob())
      downloadLink.download = "录屏.mp4"
      downloadLink.click()
      this.recorder.screen.stop()
      this.recorder.destroy()
      this.recorder = null
      this.isRecording = false
    },
    screenPic () {
      // let ctx = this.$refs.videoArea
      return false
      let videoArea = document.querySelector('.video-full-area')
      let canvas = document.querySelector('#canvas')
      let ctx = canvas.getContext('2d')
      console.log(videoArea.style.width)
      // canvas.width = this.$refs.videoArea.style.width
      // ctx.drawImage(videoArea, 0, 0, canvas.width, canvas.height)
      return false
      window.scrollTo(0, 0) // 防止截图不完整
      this.$nextTick(() => {
        html2canvas(document.querySelector('.video-full-area'), {
          cross: true,
          backgroundColor: null // null 表示设置背景为透明色
        }).then(canvas => {
          this.imgUrl = canvas.toDataURL('image/png', 1.0) // 将图片转为base64, 0-1 表示清晰度
          // this.imgUrl = this.imgUrl.toString().substring(imgBlob.indexOf(",") + 1) // 截取base64以便上传
          console.log(this.imgUrl)
          let eleLink = document.createElement('a')
          eleLink.href = this.imgUrl
          eleLink.download = this.screenName || '气体检测图'
          document.body.appendChild(eleLink)
          eleLink.click()
          document.body.removeChild(eleLink)
          // this.cancel()
        })
      })
    },
    screen () { // 全屏
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  },
  filters: {
    findFlyer (id) {
      if (id) return ''
      let name = ''
      let flyers = sessionStorage.getItem('allflyers')
      JSON.parse(flyers).forEach(e => {
        if (id === e.id) {
          name = e.nickname
        }
      })
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.videos{
  position: relative;
  .inspection{
    height: 880px;
    position: relative;
    // overflow: hidden;
    .nav-list{
      width: 220px;
      height: 100%;
      text-align: center;
      background: #555;
      .title{
        line-height: 60px;
        color: #A9A9A9;
        font-size: 30px;
      }
      ul{
        li{
          color: #A9A9A9;
          font-size: 16px;
        }
      }
    }
    .contain{
      position: absolute;
      top: 0;
      left: 220px;
      min-width: 900px;
      padding: 20px 14px;
      height: 100%;
      .map-area{
        float: left;
        position: relative;
        width: 46%;
        height: 756px;
        .title{
          width: 220px;
          height: 50px;
          margin-bottom: 40px;
          line-height: 50px;
          text-align: center;
          font-size: 26px;
          color: #333;
          font-weight: 700;
          border: 1px solid #797979;
          background-color: #EC808D;
        }
        .map{
          width: 96%;
          height: 100%;
        }
        .layer{
          position: absolute;
          top: 90px;
          left: 0;
          width: 140px;
          padding: 10px 18px;
          border-radius: 5px;
          box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
          .layer-item{
            .btn{
              padding: 4px 4px;
              color: #25A5F7;
              border-color: #25A5F7;
              border-radius: 10px;
              background: #fff;
              cursor: pointer;
            }
          }
        }
        .drone-info{
          position: absolute;
          top: 140px;
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
      .video-area{
        float: left;
        width: 54%;
        height: 700px;
        .title{
          width: 220px;
          height: 50px;
          margin-bottom: 40px;
          line-height: 50px;
          text-align: center;
          font-size: 26px;
          color: #333;
          font-weight: 700;
          border: 1px solid #797979;
          background-color: #EC808D;
        }
        .video{
          position: relative;
          // width: 98%;
          padding: 20px 36px;
          background-color: #7F7F7F;
          .no-live{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            color: #fff;
          }
          ul{
            li{
              float: left;
              // width: 50%;
              // height: 180px;
              margin-bottom: 20px;
              &:nth-child(2n){
                margin-left: 10px;
              }
              .video-title{
                position: relative;
                height: 36px;
                line-height: 36px;
                font-size: 20px;
                color: #fff;
                text-align: center;
                background: deepskyblue;
                .full-btn{
                  position: absolute;
                  top: 0;
                  right: 10px;
                  width: 40px;
                  height: 100%;
                  font-size: 28px;
                  &:hover{
                    cursor: pointer;
                  }
                }
                .video-live{
                  display: inline-block;
                }
              }
            }
          }
        }
      }
    }
  }
  .video-full-area{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90%;
    .title{
      position: absolute;
      top: 10px;
      padding: 10px 26px;
      text-align: center;
      font-size: 20px;
      color: #333;
      background: #81D3F8;
      z-index: 9999;
    }
    button{
      position: absolute;
      top: 10px;
      right: 60px;
      padding: 10px 26px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      border-radius: 10px;
      background: #3D93FD;
      z-index: 9999;
    }
    .video-btn{
      position: absolute;
      top: 844px;
      width: 120px;
      height: 120px;
      font-size: 28px;
      border-radius: 50%;
      opacity: .3;
      z-index: 9999;
      &:hover{
        opacity: 1;
      }
    }
    .shot-pic{
      right: 200px;
      color: #fff;
      background: #585AA3;
    }
    .video-down{
      right: 60px;
      color: #FFFF80;
      background: #92101C;
    }
  }
}
</style>
