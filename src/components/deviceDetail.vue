<template>
  <div class="drone">
    <div class="title clearfix">
      <h3>设备详情</h3>
    </div>
    <div class="detail">
      <div class="padding">
        <ul>
          <li v-for="e in droneInfo" :key="e.id" class="drone">
            <img src="http://www4.djicdn.com/cms/uploads/19b4fb106eee1bbdb80fe51915c9f2a6.png" alt="" @click="e.show = !e.show">
            <div class="del-drone">
              <span class="iconfont icon-iconfontshanchu5" @click="delDrone(e.id)"></span>
            </div>
            <p>{{e.name}}</p>
            <ul class="info" v-show="e.show">
              <li><span>名称：</span>{{e.name}}</li>
              <li><span>型号：</span>{{e.model}}</li>
              <li><span>责任人：</span>{{e.reponsible_people}}</li>
              <li><span>设备配件：</span>{{e.parts}}</li>
              <li><span>设备价值：</span>{{e.value}} 元</li>
              <li><span>第三方责任险：</span>{{e.insurance}}</li>
              <li><span>备注：</span>{{e.notes}}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-if="!manager" class="add-team" @click="isAddDrone = true">+</div>
    </div>
    <!-- 添加设备 -->
    <el-dialog
      title="新增设备"
      :visible.sync="isAddDrone"
      :show-close="false"
      :close-on-click-modal="false"
      width="790px"
      center>
      <el-form :inline="true" ref="ruleForm" :model="drone" :rules="rules" :label-position="'right'" class="mb40">
        <el-form-item label="名称：" label-width="120px" prop="name">
          <el-input placeholder="请输入名称" v-model="drone.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="型号：" label-width="120px" prop="model">
          <el-input placeholder="请输入型号" v-model="drone.model" clearable></el-input>
        </el-form-item>
        <el-form-item label="序列号：" label-width="120px" prop="djId">
          <el-input placeholder="请输入序列号" v-model="drone.djId" clearable></el-input>
        </el-form-item>
        <el-form-item label="责任人：" label-width="120px" prop="responsible">
          <el-select v-model="drone.responsible" clearable>
            <el-option
              v-for="e in flyers"
              :key="e.id"
              :label="e.nickname"
              :value="e.nickname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备价值：" label-width="120px" prop="value">
          <el-input placeholder="请输入设备价值" v-model="drone.value" clearable></el-input>
        </el-form-item>
        <el-form-item label="第三方责任险：" label-width="120px" prop="insurance">
          <el-input placeholder="请输入第三方责任险" v-model="drone.insurance" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备配件：" label-width="120px" prop="fitting">
          <el-input type="textarea" placeholder="请输入设备配件" v-model="drone.fitting" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注：" label-width="120px">
          <el-input type="textarea" placeholder="请输入备注" v-model="drone.remark" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="飞行执照" label-width="120px">
          <el-button>上传图片</el-button>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddDrone">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      allFlyers: [], // 所有飞手（没有团队的飞手（删除还有飞手的团队造成）和有团队的飞手）
      allTeams: [],
      show: false,
      isAddDrone: false,
      flyers: [], // 有团队的飞手
      allDroneInfos: [],
      droneInfo: [],
      drone: {
        djId: '',
        name: '',
        model: '',
        responsible: '',
        fitting: '',
        value: '',
        insurance: '',
        remark: ''
      },
      rules: { // 添加无人机必填项
        name: [
          {required: true, message: '请输入无人机名称', trigger: 'blur'}
        ],
        model: [
          {required: true, message: '请选择无人机型号', trigger: 'blur'}
        ],
        djId: [
          {required: true, message: '请输入无人机序列号', trigger: 'blur'}
        ],
        responsible: [
          {required: true, message: '请输入责任人', trigger: 'blur'}
        ],
        value: [
          {required: true, message: '请输入无人机的价值', trigger: 'blur'},
          {type: 'number', message: '无人机的价值必须为数字'}
        ],
        fitting: [
          {required: true, message: '请输入无人机配件', trigger: 'blur'}
        ],
        insurance: [
          {required: true, message: '请输入第三方责任险', trigger: 'blur'}
        ]
      },
      curSubaccount: false
    }
  },
  created () {},
  mounted () {
    this.getDrones(false)
    if (this.manager) {
      // this.getTeamInfo()
    } else {
      this.getCurAccountFlyers()
    }
    this.$bus.$on('searchCurTeam', id => {
      this.droneInit(this.$store.state.curSubaccountId)
    })
  },
  watch: {
    'drone.value': function(val){ // 监听的无人机价值只能为数字
      if (!val) {
        this.drone.value = ''
        return false
      }
      this.drone.value = val.match(/\d/ig) ? val.match(/\d/ig).join('') : ''
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
    getDrones (id) { // 获取无人机信息(id作为管理员根据账号帅选出所属账号的无人机)
      let url = this.manager ? this.api.managerInfo : this.api.subAccountInfo
      this.$axios.get(url, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.$store.commit('GET_SUBACCOUNTS', res.Data.subaccount)
          if (!id) {
            res.Data.drones.forEach(e => e.show = false)
            this.allDroneInfos = res.Data.drones
          } else if (this.manager && id) {
            this.allDroneInfos = []
            let arr = []
            res.Data.subaccount.forEach(e => {
              if (e.id === id) {
                (e.drones.replace(/(\[)|(\])/g, '')).split(',').forEach(item => {
                  arr.push(item)
                })
              }
            })
            res.Data.drones.forEach(e => {
              arr.forEach(item => {
                if (e.id === item*1) {
                  this.allDroneInfos.push(e)
                }
              })
            })
            this.allDroneInfos.forEach(e => e.show = false)
          } else {
            this.allDroneInfos = []
          }
          if (!this.manager) {
            res.Data.drones.forEach(e => e.show = false)
            this.droneInfo = res.Data.drones
          } else {
            this.droneInit(this.$store.state.curSubaccountId)
          }
        }
      })
    },
    droneInit (subId) {
      this.droneInfo = []
      this.allDroneInfos.forEach(e => {
        if (e.add_id === subId) {
          this.droneInfo.push(e)
        }
      })
    },
    getCurAccountFlyers () { // 获取当前账户团队的所有飞手
      let url = this.manager ? this.api.managerInfo : this.api.teamflyers
      this.$axios.get(url, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.allFlyers = res.Data.flyers
          this.allTeams = res.Data.teams
          let flyersId = []
          this.allTeams.forEach(e => {
            if (e.flyers_ids) {
              e.flyers_ids.forEach(item => flyersId.push(item))
            }
          })
          flyersId.forEach(e => {
            this.allFlyers.forEach(item => {
              if (item.id === e) {
                this.flyers.push(item)
              }
            })
          })
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    cancelAddDrone () { // 取消添加无人机
      this.isAddDrone = false
      for (let i in this.drone) {
        this.drone[i] = ''
      }
    },
    confirmAdd () { // 添加无人机
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            dj_id: this.drone.djId,
            insurance: this.drone.insurance,
            manager_id: this.$store.state.userInfo.ID,
            model: this.drone.model,
            name: this.drone.name,
            note: this.drone.remark,
            parts: this.drone.fitting,
            respone_people: this.drone.responsible,
            value: this.drone.value * 1
          }
          this.$axios.post(this.api.addDrone, data, {
            params: this.params
          }).then(res => {
            if (res.Status === 0) {
              this.getDrones()
              this.$message.success('添加无人机成功!')
              this.isAddDrone = false
            } else {
              this.$message.error(res.Msg)
            }
          })
        } else {
          return false
        }
      })
    },
    delDrone (id) { // 删除无人机
      let data = {
        id
      }
      this.$axios.post(this.api.deleteDrone, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.getDrones()
          this.$message.success('删除无人机成功！')
        } else {
          this.$message.error(res.Msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drone{
  background: #fff;
  .title{
    height: 60px;
    line-height: 60px;
    background: #81D3F8;
    h3{
      float: left;
      margin-left: 60px;
      font-size: 26px;
      color: #000;
      font-weight: 700;
    }
  }
  .detail{
    position: relative;
    background: #fff;
    .padding{
      height: 785px;
      margin: 15px;
      background: #EA7382;
      ul{
        padding-top: 40px;
        .drone{
          position: relative;
          float: left;
          width: 200px;
          height: 200px;
          margin-left: 20px;
          margin-bottom: 20px;
          text-align: center;
          .del-drone{
            position: absolute;
            right: 10px;
            bottom: 8px;
            font-size: 20px;
            &:hover{
              cursor: pointer;
            }
          }
          img{
            display: inline-block;
            width: 100%;
            height: 200px;
            background: #fff;
            &:hover{
              cursor: pointer;
            }
          }
          p{
            font-size: 20px;
            font-weight: 700;
          }
          .info{
            position: absolute;
            top: 80px;
            left: 80px;
            padding: 0;
            border: 1px solid #999;
            background: #fff;
            z-index: 999;
            li{
              width: 220px;
              padding: 6px 0 0;
              margin-left: 20px;
              margin-bottom: 10px;
              text-align: left;
              span{
                font-size: 16px;
                font-weight: 700;
              }
            }
          }
        }
      }
    }
    .add-team{
      position: absolute;
      top: 80px;
      right: 50px;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
      font-size: 50px;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 50%;
      background: #009DD9;
      box-shadow: 1px 1px 1px #fff;
      &:hover{
        cursor: pointer;
      }
    }
  }
}
</style>
