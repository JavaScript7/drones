<template>
  <div class="fight-log">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="search.activeDevice" clearable>
          <el-option
            v-for="e in drones"
            :key="e.id"
            :label="e.name"
            :value="e.id"></el-option>
        </el-select>
        <el-button type="primary" @click="getDroneLog(pagination.curPage, pagination.size)">选择设备</el-button>
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
        <el-button type="primary" @click="getDroneLog(pagination.curPage, pagination.size)">搜索</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" icon="el-icon-search" @click="getDroneLog(pagination.curPage, pagination.size)" clearable>搜索</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-input v-model="search.name" placeholder="请输入任务名称" clearable></el-input>
      </el-form-item>
    </el-form>
    <el-table
      :data="flyerLog"
      border
      :loading="loading"
      class="table">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="60"
        sortable>
        <template slot-scope="scope">
          {{(pagination.curPage - 1) * pagination.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="task_name"
        label="任务名称"
        width="110"
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
        align="center">
        <template slot-scope="scope">{{scope.row.time}} s</template>
      </el-table-column>
      <el-table-column
        label="飞行距离"
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
    <div class="paginate mb40">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.curPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
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
      :show-close="true"
      :close-on-click-modal="false"
      width="60%"
      :loading="loading"
      center>
      <track-map class="dialog-map" v-if="isTrackPlay"></track-map>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTrack">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import trackMap from '../components/track'
export default {
  components: {
    trackMap
  },
  data () {
    return {
      loading: false,
      search: {
        time: '',
        name: '',
        activeDevice: ''
      },
      drones: [],
      time: '',
      keyword: '',
      flyerLog: [],
      delDialog: false,
      delId: '',
      isTrackPlay: false,
      map: null,
      fileName: '',
      json_data: [],
      pagination: {
        total: 0,
        curPage: 1,
        size: 10
      }
    }
  },
  created () {},
  mounted () {
    this.getDroneLog(this.pagination.curPage, this.pagination.size)
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
    getDroneLog (val, size) {
      this.loading = true
      let startTime = this.search.time ? this.search.time[0] / 1000 : 0
      let endTime = this.search.time ? this.search.time[1] / 1000 : 0
      let data = {
        drone_id: this.search.activeDevice || 0,
        end_time: endTime,
        name: this.search.name,
        start_time: startTime
      }
      this.$axios.post(this.api.searchFlyLog, data, {
        params: {
          id: this.$store.state.userInfo.ID,
          token: this.$store.state.userInfo.SocketToken,
          limit: size,
          offset: val - 1
        }
      }).then(res => {
        if (res.Status === 0) {
          this.flyerLog = res.Data.log
          this.pagination.total = res.Data.count
          this.loading = false
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    download (row) { // 开启下载轨迹文件
      this.fileName = row.task_name
      this.$axios.post(this.api.logPos, { id: row.id }, {
        params: this.params
      }).then(res => {
        if (res.length !== 0) {
          this.export2Excel(res, this.fileName)
        } else {
          this.$message.error('暂无数据！')
          return []
        }
      })
    },
    export2Excel (jsonData, name) { // 下载轨迹文件
      require.ensure([], () => {
        let { export_json_to_excel } = require('@/excel/export2Excel') // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        let tHeader = ['时间', '经度', '纬度', '速度', '高度'] // 导出的表头名信息
        let filterVal = ['timestamp', 'longtitue', 'latitude', 'speed', 'high'] // 导出的表头字段名，需要导出表格字段名
        let data = this.formatJson(filterVal, jsonData)
        data.forEach(e => e[0] = this.unit.timestampToTime(e[0]))
        export_json_to_excel(tHeader, data, name)
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
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
          this.getDroneLog(this.pagination.curPage, this.pagination.size)
          this.delDialog = false
          this.$message.success('删除日志成功！')
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    trackPlayback (id) { // 开启轨迹对话框
      this.loading = true
      this.isTrackPlay = true
      setTimeout(() => {
        this.loading = false
        this.$bus.$emit('trackInit', id)
      }, 100)
    },
    closeTrack () { // 关闭轨迹对话框
      this.$bus.$emit('closeMap')
      this.isTrackPlay = false
    },
    handleSizeChange (size) {
      this.pagination.size = size
      this.getDroneLog(this.pagination.curPage, this.pagination.size)
    },
    handleCurrentChange (val) {
      this.pagination.curPage = val
      this.getDroneLog(this.pagination.curPage, this.pagination.size)
    }
  }
}
</script>

<style lang="scss" scoped>
.fight-log{
  padding: 30px;
  .el-table{
    .icon-ziyuan{
      font-size: 20px;
      cursor: pointer;
    }
  }
}
.maps{
  width: 100%;
  height: 400px;
}
.table{
  width: 100%;
  margin-bottom: 30px;
}
.paginate{
  position: relative;
  .el-pagination{
    text-align: center;
  }
  .page-sum{
    position: absolute;
    left: 30%;
    bottom: 0px;
    width: 120px;
    height: 32px;
    line-height: 32px;
    color: #000;
    font-size: 14px;
    text-align: center;
  }
}
.dialog-map{
  width: 100%;
  height: 400px;
}
</style>
