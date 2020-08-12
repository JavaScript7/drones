<template>
  <div class="container">
    <el-form :inline="true" :model="task" :rules="rules" ref="ruleForm" :label-position="'right'"  class="mb40">
      <el-row>
        <el-col :span="8">
          <el-form-item label="选择日期" label-width="120px" prop="time">
            <el-date-picker
              v-model="task.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执行单位" label-width="120px" prop="name">
            <el-select v-model="task.name" clearable placeholder="请选择" @change="selectFlyer(task.name)">
              <el-option
                v-for="e in teams"
                :key="e.id"
                :label="e.label"
                :value="e.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="任务类型" label-width="120px" prop="type">
            <el-select v-model="task.type" placeholder="请选择" clearable>
              <el-option
                v-for="e in types"
                :key="e.roleid"
                :label="e.rolename"
                :value="e.rolename">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执法人员" label-width="120px" prop="executor">
            <el-select v-model="task.executor" clearable placeholder="请选择" @change="selectPhone(task.executor)">
              <el-option
                v-for="e in flyers"
                :key="e.id"
                :label="e.nickname"
                :value="e.nickname"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系电话" label-width="120px" prop="phone">
            <el-input placeholder="请输入" maxlength="11" v-model="task.phone" clearable disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执法地点" label-width="120px" prop="location">
            <el-input placeholder="请输入" v-model="task.location" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="任务描述" label-width="120px" class="textarea" prop="description">
            <el-input type="textarea" placeholder="请输入" v-model="task.description" clearable resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" style="text-align: center;margin-top: 60px;">
          <el-button type="primary" @click="submit">提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      drones: [],
      teams: [],
      allFlyers: [], // 所有飞手
      flyers: [], // 当前选中团队的飞手
      task: {
        time: '',
        type: '',
        name: '',
        executor: '',
        phone: '',
        unit: '',
        location: '',
        description: ''
      },
      rules: {
        time: [
          {required: true, message: '请选择日期', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入项目名称', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择任务类型', trigger: 'blur'}
        ],
        executor: [
          {required: true, message: '请输入执法人员', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号码', trigger: 'blur'}
        ],
        location: [
          {required: true, message: '请输入执法地点', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入任务描述', trigger: 'blur'}
        ]
      },
      selectVal: '',
      subusers: []
    }
  },
  created () {},
  mounted () {
    this.getSubusers()
    this.getManagerInfo()
  },
  computed: {
    manager () {
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
          this.teams = res.Data.teams
          this.allFlyers = res.Data.flyers
        }
      })
    },
    getSubusers () {
      this.$axios.get(this.api.subusers, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.subusers = res.Data
        }
      })
    },
    selectFlyer (name) { // 根据团队选中飞手
      if (!name) {
        this.flyers = []
        this.task.executor = ''
        return false
      }
      let arr = []
      this.teams.forEach(e => {
        if (e.name === name) {
          arr = (e.flyers.replace(/(\[)|(\])/g, '')).split(',')
        }
      })
      this.flyers = []
      this.allFlyers.forEach(e => {
        arr.forEach(item => {
          if (e.id === item*1) {
            this.flyers.push(e)
          }
        })
      })
    },
    selectPhone (name) { // 根据飞手选中飞手电话
      if (!name) {
        this.task.phone = ''
        return false
      }
      this.flyers.forEach(e => {
        if (e.nickname === name) {
          this.task.phone = e.phone
        }
      })
    },
    submit () { // 派发任务
      let executorId = ''
      this.flyers.forEach(e => {
        if (e.nickname === this.task.executor) {
          executorId = e.id
        }
      })
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            description: this.task.description,
            start_time: this.task.time[0] / 1000 || '',
            end_time: this.task.time[1] / 1000 || '',
            executor: this.task.executor,
            executor_id: executorId,
            name: this.task.name,
            phone: this.task.phone,
            position: this.task.location,
            roletype: this.task.type
          }
          this.$axios.post(this.api.addTask, data, {
            params: this.params
          }).then(res => {
            if (res.Status === 0) {
              for(let key in this.task){
                this.task[key] = ''
              }
              this.$message.success('派发任务成功！')
            } else {
              this.$message.error(res.Msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  height: 500px;
  padding: 30px 20px 0;
  border: 1px solid #797979;
  color: #333;
  font-size: 16px;
  overflow: hidden;
}
</style>
