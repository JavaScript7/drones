<template>
  <div>
    <div class="container">
      <div class="map" id="maps"></div>
      <div class="layer">
        <div class="layer-item">
          <button class="btn" id="add-layer" @click="addSatelliteLayer">卫星图层</button>
          <button class="btn" id="remove-layer" @click="removeSatelliteLayer">标准图层</button>
        </div>
      </div>
      <div class="manage" ref="manage">
        <div class="arrow" @click="showNav">
          <p v-if="isShow">&gt;</p>
          <p v-else>&lt;</p>
        </div>
        <div class="title">
          <img src="../../static/img/logo.png" alt="">
          <div class="head">
            <h3>应急无人机综合管理平台</h3>
            <h4>{{name}}</h4>
          </div>
        </div>
        <div class="drone-manage">
          <div class="title">无人机管理</div>
          <el-row class="mb10">
            <el-col :span="12">
              <el-select v-model="selectVal" size="small" clearable>
                <el-option
                  v-for="item in cities"
                  :key="item.id"
                  :label="item.city"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="search" >
            <el-col :span="12">
              <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="请输入关键字" size="small" clearable></el-input>
            </el-col>
            <el-col :span="12">
              <el-button size="small">搜索</el-button>
              <el-button size="small">重置</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            border
            max-height="250"
            class="table"
            :row-style="{height: '26px'}"
            :cell-style="{padding: '0'}"
            style="width: 100%">
            <el-table-column
              prop="unit"
              label="所属单位"
              align="center">
            </el-table-column>
            <el-table-column
              prop="num"
              label="无人机数量"
              align="center"
              sortable
              width="116">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button @click="look(scope.index)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="inline">
            <div class="title">在线无人机</div>
            <ul>
              <li v-for="(e, i) in inlineDrones" :key="e.id">
                <!-- <img :src="e.img" alt=""> -->
                <img src="../../static/img/u17.jpg" alt="">
                <span>{{e.name}}</span>
                <span>{{e.type}}</span>
                <span>{{e.unit}}</span>
                <span :class="e.show ? 'active-posi' : ''" @click="activePosition(e, i)">{{e.show ? '取消定位' : '定位'}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <el-dialog
        :visible.sync="teamDialog"
        center
        :show-close="false"
        @close="teamDialog = false"
        :close-on-click-modal="false"
        width="30%">
        <div class="contain">
          <p class="text mb10">当前团队： {{teamInfo.name}}</p>
          <div class="team-title text mb10">团队成员:</div>
          <ul class="member mb10">
            <li v-for="e in teamInfo.member" :key="e.id">
              <div><img src="" alt="" @mouseover="e.show = true" @mouseleave="e.show = false"></div>
              <span>{{e.post}}</span>
              <ul class="pernson-info" v-show="e.show">
                <li>姓名：{{e.name}}</li>
                <li>电话：{{e.phone}}</li>
                <li>身份证：{{e.idCard}}</li>
                <li>年龄：{{e.age}}</li>
                <li>无人机驾龄：{{e.drivingAge}}</li>
                <li>
                  <span>飞行执照：</span>
                  <img src="" alt="">
                </li>
              </ul>
            </li>
          </ul>
          <div class="team-title text mb10">设备:</div>
          <ul class="member mb10">
            <li v-for="e in teamInfo.device" :key="e.id">
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
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="teamDialog = false">关  闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      managerInfo: [], // 管理员信息
      flyers: [], // 飞手信息
      droneInfo: [], // 无人机信息
      map: null,
      layer: false, // 卫星图层是否开启
      satelliteLayer: null,
      marker: [],
      isShow: true,
      name: '公安无人机中队',
      selectVal: '',
      keyword: '',
      cities: [
        {id: 0, city: '思明区'},
        {id: 1, city: '湖里区'},
        {id: 2, city: '海沧区'},
        {id: 3, city: '集美区'},
        {id: 4, city: '同安区'},
        {id: 5, city: '翔安区'}
      ],
      tableData: [{
        id: 1,
        unit: '思明公安无人机1队',
        num: '16'
      }, {
        id: 2,
        unit: '思明公安无人机1队',
        num: '49'
      }, {
        unit: '思明公安无人机1队',
        num: '16'
      }, {
        id: 3,
        unit: '思明公安无人机1队',
        num: '10'
      }],
      teamDialog: false,
      teamInfo: {
        name: '思明公安无人机1队',
        member: [
          {id: 1, post: '队长', name: '林春生', age: 20, phone: 13164504649, idCard: 350823202052002020201, license: 'img.png', drivingAge: '6年', show: false},
          {id: 2, post: '飞手1', name: '张三', age: 13, phone: 13164504649, idCard: 350823202052002020202, license: 'img.png', drivingAge: '1年', show: false},
          {id: 3, post: '飞手2', name: '李四', age: 15, phone: 13164504649, idCard: 350823202052002020203, license: 'img.png', drivingAge: '0年', show: false},
          {id: 4, post: '飞手3', name: '王武', age: 12, phone: 13164504649, idCard: 350823202052002020204, license: 'img.png', drivingAge: '1年', show: false}
        ],
        device: [
          {id: 1, name: '无人机01', type: 'DJI-M600', responsible: '蓝景', fitting: '摄像机、无人机、遥感摄像机、无人机、遥感摄像机、无人机、遥感、无人机、遥感、无人机、遥感、无人机、遥感', value: '10万元', liability: '中国保险公司', remark: '备注', show: false},
          {id: 2, name: '无人机01', type: 'DJI-M600', responsible: '蓝景', fitting: '摄像机、无人机、遥感、无人机、遥感、无人机、遥感、无人机、遥感', value: '10万元', liability: '中国保险公司', remark: '备注', show: false},
          {id: 3, name: '无人机01', type: 'DJI-M600', responsible: '蓝景', fitting: '摄像机、无人机、遥感', value: '10万元', liability: '中国保险公司', remark: '备注', show: false},
          {id: 4, name: '无人机01', type: 'DJI-M600', responsible: '蓝景', fitting: '摄像机、无人机、遥感', value: '10万元', liability: '中国保险公司', remark: '备注', show: false}
        ]
      },
      inlineDrones: [
        {img: '../../../static/img/u17.jpg', name: '飞手1', type: '机型1', unit: '思明公安无人机1队',latitude: '112.12345131654445', longtitude: '23.12312222222244', show: false},
        {img: '../../../static/img/u17.jpg', name: '飞手2', type: '机型2', unit: '思明公安无人机1队',latitude: '118.116646', longtitude: '24.471346', show: false},
        {img: '../../../static/img/u17.jpg', name: '飞手3', type: '机型3', unit: '思明公安无人机1队',latitude: '118.118646', longtitude: '24.441346', show: false},
        {img: '../../../static/img/u17.jpg', name: '飞手4', type: '机型4', unit: '思明公安无人机1队',latitude: '118.125646', longtitude: '24.481346', show: false},
        {img: '../../../static/img/u17.jpg', name: '飞手5', type: '机型5', unit: '思明公安无人机1队',latitude: '118.116646', longtitude: '24.461346', show: false},
      ],
      inlineLists: [],
      showPosit: false, // 显示当前定位
      activeIndex: null,
      isInfoWindow: false // 是否窗体显示无人机信息
    }
  },
  mounted () {
    this.mapInit()
    this.getDroneInfo()
    if (this.manager) {
      this.getManagerInfo()
    }
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
    getManagerInfo () {
      this.$axios.get(this.api.managerInfo, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.managerInfo = res.Data
          let flyers = res.Data.flyers
          this.flyers = []
          for (let i in flyers) {
            this.flyers.push(flyers[i])
          }
        }
      })
    },
    getDroneInfo () {
      let data = sessionStorage.getItem('droneInfo')
      this.droneInfo = JSON.parse(data)
      console.log(this.droneInfo)
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
        zoom: 13
        // center: ['118.1156', '24.4313'] // 经度越大越往右，纬度越大越往上['113.944', '22.5306']
      })
      this.satelliteLayer = new AMap.TileLayer.Satellite() // 卫星图层
      this.markerInit()
      let adcode = this.map.getAdcode()
      let center = this.map.getCenter()
      this.map.setCenter([center.lng, center.lat])
      // this.map.setFitView()
    },
    markerInit () {
      let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(10, 0)})
      this.inlineDrones.forEach((item, i) => {
        let marker = ''
        let lat = item.latitude
        let lng = item.longtitude
        marker = new AMap.Marker({
          position: new AMap.LngLat(lat, lng),
          map: this.map,
          clickable: true,
          // icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          offset: new AMap.Pixel(0, 0)
        })
        marker.content = `<p>序号：${i}</p>
        <p>名字：${item.name}</p>
        <p>单位：${item.unit}</p>
        `
        marker.on('click', e => {
          // console.log(i)
          this.isInfoWindow = !this.isInfoWindow
          if (this.isInfoWindow) {
            infoWindow.setContent(e.target.content)
            infoWindow.open(this.map, e.target.getPosition())
          } else {
            infoWindow.close()
          }
        })
        // marker.emit('click', {target: marker})
        this.marker.push(marker)
      })
    },
    addSatelliteLayer () {
      this.map.add(this.satelliteLayer)
    },
    removeSatelliteLayer () {
      this.map.remove(this.satelliteLayer)
    },
    showNav () {
      this.$refs.manage.style.right = this.isShow ? (-454 + 'px') : 0
      this.isShow = !this.isShow
    },
    activePosition (e, i) {
      this.map.remove(this.marker)
      if (e.show) {
        e.show = false
        this.markerInit()
        this.map.setFitView()
        return false
      }
      this.inlineDrones.forEach(item => item.show = false)
      e.show = true
      let lat = e.latitude
      let lng = e.longtitude
      let marker = ''
      marker = new AMap.Marker({
        position: new AMap.LngLat(lat, lng),
        map: this.map,
        // icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        offset: new AMap.Pixel(-10, -20)
      })
      this.marker.push(marker)
      this.map.setFitView()
    },
    look (index) {
      this.teamDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  position: relative;
  overflow: hidden;
}
.map{
  width: 100%;
  height: 857px;
}
.layer{
  position: absolute;
  top: 0;
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
    img{
      width: 80px;
      height: 90px;
      vertical-align: top;
      background-color: #12B7FF;
    }
    .head{
      display: inline-block;
      width: 340px;
      text-align: center;
      h3{
        line-height: 50px;
        font-size: 30px;
        color: #8080FF;
        font-weight: 700;
      }
      h4{
        font-size: 24px;
        color: #000;
        font-weight: 700;
      }
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
      border: 1px solid #000;
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
.contain{
  // position: relative;
  .pernson-info{
    position: absolute;
    top: 42px;
    left: 58px;
    width: 218px;
    padding: 10px;
    border: 1px solid #000;
    background-color: #fff;
    z-index: 99999;
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
}
.inline{
  ul{
    li{
      span{
        &:last-child{
          cursor: pointer;
        }
      }
    }
  }
}
.active-posi{
  color: #e4bf71;
}
</style>
