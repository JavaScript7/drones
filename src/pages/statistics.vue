<template>
  <div>
    <div class="content">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="activeDevice" clearable>
            <el-option
              v-for="e in drones"
              :key="e.id"
              :label="e.name"
              :value="e.id"></el-option>
          </el-select>
          <el-button type="primary" @click="onSearch">选择设备</el-button>
        </el-form-item>
      </el-form>
      <div class="chart">
        <div id="time" class="chart-item1"></div>
        <div id="sorting" class="chart-item2"></div>
        <div id="mileage" class="chart-item3"></div>
        <!-- <div id="speed" class="chart-item4"></div> -->
      </div>
    </div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/grid')
export default {
  data () {
    return {
      activeDevice: '',
      drones: [],
      dronesTime: [],
      flyCount: [], // 出行任务架次
      miles: [], // 飞行路程
      timelong: [], // 飞行时长
      flightTime: {
        xdata: ['2020-1', '2020-2', '2020-3', '2020-4', '2020-5', '2020-6', '2020-7'],
        ydata: ['13', '124', '12', '45', '0', '45', '36']
      }
    }
  },
  created () {},
  mounted () {
    this.getDrones()
    this.getFlyStat()
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
    getFlyStat () {
      this.$axios.post(this.api.flyStat, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.$nextTick(() => {
            res.Data.forEach(e => this.dronesTime.push(e.date))
            res.Data.forEach(e => this.flyCount.push(e.fly_count))
            res.Data.forEach(e => this.miles.push(e.miles))
            res.Data.forEach(e => this.timelong.push(e.timelong))
            this.barTimeInit()
            this.barMileageInit()
            this.lineSortingInit()
            // this.lineSpeedInit()
          })
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    barTimeInit () {
      let myChart = echarts.init(document.getElementById('time'))
      myChart.setOption({
        title: {
          text: '飞行时长',
          left: 'center'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          // data: this.dronesTime,
          data: this.flightTime.xdata
        },
        yAxis: {},
        series: [{
          name: '飞行时长',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#8384FA',
              label: {
                show: true,
                position: 'top',
                formatter: '{c}min',
                textStyle: {
                  color: 'black',
                  fontSize: 10
                }
              }
            }
          },
          // data: this.timelong
          data: this.flightTime.ydata
        }]
      })
    },
    barMileageInit () {
      let myChart = echarts.init(document.getElementById('mileage'))
      myChart.setOption({
        title: {
          text: '飞行里程',
          left: 'center'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          // data: this.dronesTime
          data: this.flightTime.xdata
        },
        series: [{
          name: '飞行里程',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#08C8C1',
              label: {
                show: true,
                position: 'right',
                formatter: '{c}km',
                textStyle: {
                  color: 'black',
                  fontSize: 10
                }
              }
            }
          },
          // data: this.miles
          data: this.flightTime.ydata
        }]
      })
    },
    lineSortingInit () {
      let myChart = echarts.init(document.getElementById('sorting'))
      myChart.setOption({
        title: {
          text: '飞行架次',
          left: 'center'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // data: this.dronesTime
          data: this.flightTime.xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '飞行架次',
          type: 'line',
          areaStyle: {},
          itemStyle: {
            normal: {
              color: '#33B1DA',
              label: {
                show: true,
                position: 'top',
                formatter: '{c}次',
                textStyle: {
                  color: 'black',
                  fontSize: 10
                }
              }
            }
          },
          // data: this.flyCount
          data: this.flightTime.ydata
        }]
      })
    },
    lineSpeedInit () {
      let myChart = echarts.init(document.getElementById('speed'))
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      })
      // myChart.setOption({
      //   title: {
      //     text: '飞行平均速度',
      //     left: 'center'
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: 'category',
      //     data: this.flightTime.xdata
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   series: [{
      //     name: '飞行平均速度',
      //     type: 'line',
      //     itemStyle: {
      //       normal: {
      //         color: '#F8ACF0',
      //         label: {
      //           show: true,
      //           position: 'top',
      //           formatter: '{c}m/s',
      //           textStyle: {
      //             color: 'black',
      //             fontSize: 10
      //           }
      //         }
      //       }
      //     },
      //     data: [6.2, 6.3, 7.0, 7.0, 7.2, 5.8, 6.6]
      //   }]
      // })
    },
    onSearch () {}
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 30px;
  .chart{
    width: 100%;
    .chart-item1{
      float: left;
      width: 40%;
      height: 300px;
      margin-left: 6%;
      margin-bottom: 40px;
    }
    .chart-item2{
      float: left;
      width: 40%;
      height: 300px;
      margin-left: 10%;
      margin-bottom: 40px;
    }
    .chart-item3{
      float: left;
      width: 40%;
      height: 300px;
      margin-left: 6%;
    }
    .chart-item4{
      float: left;
      width: 40%;
      height: 300px;
      margin-left: 10%;
    }
  }
}
</style>
