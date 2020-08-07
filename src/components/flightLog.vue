<template>
  <div class="content">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="search.activeDevice" clearable>
          <el-option
            v-for="e in drones"
            :key="e.id"
            :label="e.name"
            :value="e.id"></el-option>
        </el-select>
        <el-button type="primary" @click="getDroneLog">选择设备</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="选择时间">
        <el-date-picker
          v-model="search.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" @click="getDroneLog">搜索</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" icon="el-icon-search" @click="getDroneLog" clearable>搜索</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-input v-model="search.name" placeholder="请输入内容" clearable></el-input>
      </el-form-item>
    </el-form>
    <el-table
      :data="flyerLog"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="日志ID"
        width="220"
        align="center">
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center">
        <template slot-scope="scope">{{scope.row.start_time | timeStamp(true)}}</template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center">
        <template slot-scope="scope">{{scope.row.end_time | timeStamp(true)}}</template>
      </el-table-column>
      <el-table-column
        label="飞行时长"
        width="180"
        align="center">
        <template slot-scope="scope">{{scope.row.time}} s</template>
      </el-table-column>
      <el-table-column
        label="飞行距离"
        width="180"
        align="center">
        <template slot-scope="scope">{{scope.row.mileage}} m</template>
      </el-table-column>
      <el-table-column
        prop="track"
        label="轨迹回放"
        align="center">
        <template slot-scope="scope">
          <p class="iconfont icon-ziyuan" @click="trackPlayback(scope.row.id)"></p>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button @click="download(scope.row)" type="primary" size="small" icon="el-icon-download">下载</el-button>
          <el-button type="primary" size="small" icon="el-icon-delete" @click="delLog(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="删除"
      :visible.sync="delDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="30%"
      center>
      <p class="toptip">确认删除该飞行日志?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="轨迹回放"
      :visible.sync="isTrackPlay"
      :show-close="false"
      :close-on-click-modal="false"
      width="60%"
      center>
      <div id="comtainer" class="maps"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTrack">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        time: '',
        name: '',
        activeDevice: ''
      },
      drones: [],
      time: '',
      keyword: '',
      tableData: [{
        device: 'DJ-精灵4',
        name: '任务1',
        beginDate: '2020-02-03',
        endDate: '2020-02-06',
        time: 16,
        distance: 465,
        track: ''
      }, {
        device: 'DJ-精灵4pro',
        name: '任务1',
        beginDate: '2020-02-03',
        endDate: '2020-02-06',
        time: 16,
        distance: 465,
        track: ''
      }, {
        device: 'DJ-精灵4pro',
        name: '任务1',
        beginDate: '2020-02-03',
        endDate: '2020-02-06',
        time: 16,
        distance: 465,
        track: ''
      }, {
        device: 'DJ-M210',
        name: '任务1',
        beginDate: '2020-02-03',
        endDate: '2020-02-06',
        time: 16,
        distance: 465,
        track: ''
      }],
      flyerLog: [],
      delDialog: false,
      delId: '',
      isTrackPlay: false,
      map: null
    }
  },
  created () {},
  mounted () {
    this.getDroneLog()
    this.getDrones()
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
    getDrones () { // 获取无人机信息
      let url = this.manager ? this.api.managerInfo : this.api.subAccountInfo
      this.$axios.get(url, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.drones = res.Data.drones
        }
      })
    },
    getDroneLog () {
      let startTime = this.search.time ? this.search.time[0] / 1000 : 0
      let endTime = this.search.time ? this.search.time[1] / 1000 : 0
      let data = {
        drone_id: this.search.activeDevice || 0,
        end_time: endTime,
        name: this.search.name,
        start_time: startTime
      }
      this.$axios.post(this.api.searchFlyLog, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.flyerLog = res.Data.log
          // res.Data.pos
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    download (row) {},
    delLog (row) {
      this.delId = row.id
      this.delDialog = true
    },
    confirmDel () { // 删除日志
      let data = {
        id: this.delId
      }
      this.$axios.post(this.api.delFlyLog, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.getDroneLog()
          this.delDialog = false
          this.$message.success('删除日志成功！')
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    trackPlayback (id) {
      // this.mapInit()
      // this.isTrackPlay = true
      let {href} = this.$router.resolve({
        name: 'track',
        params: {
          id
        }
      })
      window.open(href, '_blank')
      return false
      this.$axios.post(this.api.logPos, {
        id
      }, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          console.log(res)
        }
      })
      this.$router.push('/track')
    },
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
      // this.satelliteLayer = new AMap.TileLayer.Satellite() // 卫星图层
      // let adcode = this.map.getAdcode()
      // let center = this.map.getCenter()
      // this.map.setCenter([center.lng, center.lat])
    },
    closeTrack () {
      this.isTrackPlay = false
      this.map = null
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 30px;
  el-table{
    .icon-ziyuan{
      font-size: 18px;
    }
  }
}
.maps{
  width: 100%;
  height: 400px;
}
</style>
