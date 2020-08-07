<template>
  <div class="track">
    <div id="comtainer" class="maps"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      map: null,
      marker: null,
      polyline: null,
      positions: [],
      positionss: [
        [116.478935,39.997761],
        [116.478939,39.997825],
        [116.478912,39.998549],
        [116.478912,39.998549],
        [116.478998,39.998555],
        [116.478998,39.998555],
        [116.479282,39.99856],
        [116.479658,39.998528],
        [116.480151,39.998453],
        [116.480784,39.998302],
        [116.480784,39.998302],
        [116.481149,39.998184],
        [116.481573,39.997997],
        [116.481863,39.997846],
        [116.482072,39.997718],
        [116.482362,39.997718],
        [116.483633,39.998935],
        [116.48367,39.998968]
      ]
    }
  },
  mounted () {
    this.mapInit()
    this.getPositions()
  },
  computed: {
    params () {
      return {
        id: this.$store.state.userInfo.ID,
        token: this.$store.state.userInfo.SocketToken
      }
    }
  },
  methods: {
    mapInit () {
      this.map = new AMap.Map('comtainer', {
        resizeEnable: true,
        mapStyle: 'https:amap://styles/1de318cbb8d12c02303a22c550b9ccc9',
        viewMode: '3D',
        features: ['bg', 'road'],
        pitch: 0,
        maxPitch: 40,
        zoom: 13
      })
      this.map.plugin(['AMap.ToolBar'], () => { // 地图放大缩小轮盘
        this.map.addControl(new AMap.ToolBar({
          position: 'LT'
        }))
      })
      // this.trackPlay()
    },
    getPositions () {
      let id = this.$route.params.id * 1
      this.$axios.post(this.api.logPos, { id }, {
        params: this.params
      }).then(res => {
        if (res.length !== 0) {
          this.positions = []
          res.forEach(e => {
            this.positions.push([e.longtitue, e.latitude])
          })
          this.trackPlay()
        } else {
          this.positions = []
          this.$message.error('暂无数据！')
        }
      })
    },
    trackPlay () {
      // 绘制轨迹
      console.log(this.positions)
      this.polyline = new AMap.Polyline({
        map: this.map, // polyline.setMap(map)
        showDir: true, // 是否显示箭头false/true
        path: this.positions,
        isOutline: true,
        outlineColor: '#ffeeff',
        borderWeight: 3,
        strokeColor: '#3366FF', 
        strokeOpacity: 1,
        strokeWeight: 6,
        // 折线样式还支持 'dashed'
        strokeStyle: 'solid',
        // strokeStyle是dashed时有效
        strokeDasharray: [10, 5],
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 50,
      })
      this.map.setFitView([ this.polyline ]) // 缩放地图到合适的视野级别
      this.markerInit()
    },
    markerInit () {
      this.marker = new AMap.Marker({
        map: this.map,
        position: this.positions[0],
        offset: new AMap.Pixel(-12, -14),
        icon: new AMap.Icon({
          // size: new AMap.Size(60, 70),    // 图标尺寸
          image: '../../static/img/fly_drone.png',  // Icon的图像
          // imageOffset: new AMap.Pixel(60, 70),  // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(24, 28)   // 根据所设置的大小拉伸或压缩图片
          // offset: Pixel(-30, 70)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.track{
  width: 100vw;
  height: 100vh;
  .maps{
    width: 100%;
    height: 100%;
  }
}
</style>
