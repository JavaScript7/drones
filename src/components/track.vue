<template>
  <div class="track">
    <div id="comtainer" class="maps"></div>
    <div class="layer">
      <h4>轨迹回放控制</h4>
      <div class="input-item">
        <input type="button" value="开始动画" @click="startAnimation">
        <input type="button" value="暂停动画" @click="pauseAnimation">
      </div>
      <div class="input-item">
        <input type="button" value="继续动画" @click="resumeAnimation">
        <input type="button" value="停止动画" @click="stopAnimation">
      </div>
      <!-- <div class="input-item">
        速度快慢<input type="range" v-model="speedTime" @change="speedTime = e.target.value">{{speedTime}}
      </div> -->
    </div>
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
      speedTime: 200
    }
  },
  mounted () {
    this.$bus.$on('trackInit', id => {
      this.$nextTick(() => {
        this.mapInit()
        this.getPositions(id)
      })
    })
    this.$bus.$on('closeMap', () => {
      this.marker = null
      this.polyline = null
      this.map && this.map.destroy()
      this.map = null
    })
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
    },
    getPositions (id) {
      this.$axios.post(this.api.logPos, { id }, {
        params: this.params
      }).then(res => {
        if (res.length !== 0) {
          this.positions = []
          for (let i=0; i<res.length; i++) {
            this.positions.push([res[i].longtitue, res[i].latitude])
          }
          this.trackPlay()
        } else {
          this.positions = []
          this.$message.error('暂无数据！')
        }
      })
    },
    trackPlay () { // 绘制轨迹
      this.polyline = new AMap.Polyline({
        map: this.map, // polyline.setMap(map)
        showDir: true, // 是否显示箭头false/true
        path: this.positions,
        isOutline: true,
        outlineColor: '#ffeeff',
        borderWeight: 1,
        strokeColor: '#3366FF',
        strokeOpacity: 1,
        strokeWeight: 1,
        // 折线样式还支持 'dashed'
        strokeStyle: 'solid',
        // strokeStyle是dashed时有效
        strokeDasharray: [10, 5],
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 50
      })
      this.map.setFitView([ this.polyline ]) // 缩放地图到合适的视野级别
      this.markerInit()
    },
    markerInit () {
      this.marker = new AMap.Marker({
        map: this.map,
        position: [this.positions[0].R, this.positions[0].Q],
        offset: new AMap.Pixel(-12, -14),
        icon: new AMap.Icon({
          // size: new AMap.Size(60, 70),    // 图标尺寸
          image: '../../static/img/fly_drone1.png',  // Icon的图像
          // imageOffset: new AMap.Pixel(60, 70),  // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(24, 28)   // 根据所设置的大小拉伸或压缩图片
          // offset: Pixel(-30, 70)
        }),
        autoRotation: true, // 自动调方向
        angle: -90 // 无人机图片箭头向右
      })
    },
    startAnimation () {
      this.marker.moveAlong(this.positions, 80)
      this.map.setFitView()
    },
    pauseAnimation () {
      this.marker.pauseMove()
    },
    resumeAnimation () {
      this.marker.resumeMove()
    },
    stopAnimation () {
      this.marker.stopMove()
    }
  },
  destroyed () {
    this.$bus.$off('trackInit') // 关闭监听，防止多次触发事件总线
    this.$bus.$off('closeMap')
  }
}
</script>

<style lang="scss" scoped>
.track{
  position: relative;
  width: 100%;
  .maps{
    width: 100%;
    height: 100%;
  }
  .layer{
    position: absolute;
    bottom: 40px;
    right: 0;
    padding: 4px 10px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    .input-item{
      padding: 4px 10px;
      input{
        display: inline-block;
        color: #25A5F7;
        border: 1px solid #25A5F7;
        border-radius: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
