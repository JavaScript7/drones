<template>
  <div class="detail">
    <div class="title clearfix">
      <h3>团队详情</h3>
      <button @click="isAddTeam = true" v-if="!manager">添加新团队</button>
    </div>
    <div class="team-info">
      <div class="team-list" v-for="(e, i) in teamInfo" :key="e.id">
        <h4>
          团队名称：
          <span v-show="!e.show">{{e.name}}</span>
          <input type="text" placeholder="请输入团队名称" v-show="e.show" v-model="e.name">
          <span class="iconfont icon-bianji font20" v-if="!manager" @click="changeTeamName(e)" title="修改团队名称"></span>
          <span class="iconfont icon-iconfontshanchu5 font20" v-if="!manager" title="删除团队" @click="delTeam(e.id)"></span>
        </h4>
        <ul>
          <li class="clearfix" v-for="(item, index) in e.flyer" :key="item.id">
            <div class="img-item">
              <img src="/static/img/u195.png" alt="" @mouseleave="showFlyerInfo(i, index)" @mouseover="showFlyerInfo(i, index)">
              <div class="operating" v-if="!manager">
                <span class="iconfont icon-bianji" @click="editFlyerInfo(item)"></span>
                <span class="iconfont icon-iconfontshanchu5" @click="delMember(item.id)"></span>
              </div>
            </div>
            <p>{{item.nickname}}</p>
            <ul class="pernson-info" v-if="item.show">
              <li>姓名：{{item.nickname}}</li>
              <li>电话：{{item.phone}}</li>
              <li>身份证：{{item.shenfenzheng}}</li>
              <!-- <li>年龄：{{item.age}} @mouseleave="item.show = false"</li> -->
              <li>无人机驾龄：{{item.fly_year}}岁</li>
              <li>
                <span>飞行执照：</span>
                <img :src="item.licence_img" alt="">
              </li>
            </ul>
          </li>
          <div class="add-team" @click="addFlyerId(e.id)">+</div>
        </ul>
      </div>
    </div>
    <!-- 添加新的团队 -->
    <el-dialog
      title="新增"
      :visible.sync="isAddTeam"
      :show-close="false"
      :close-on-click-modal="false"
      width="480px"
      center>
      <el-form :inline="true" :model="team" :label-position="'right'" class="mb40">
        <el-form-item label="团队名称" label-width="120px">
          <el-input placeholder="请输入团队名称" v-model="team.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddTeam">取 消</el-button>
        <el-button type="primary" @click="confirmAddTeam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加新飞手 -->
    <el-dialog
      title="新增飞手"
      :visible.sync="isAddFlyer"
      :show-close="false"
      :close-on-click-modal="false"
      width="780px"
      center>
      <el-form :inline="true" ref="ruleForm" :model="member" :rules="rules" :label-position="'right'" class="mb40">
        <el-form-item label="姓名" label-width="120px" prop="name">
          <el-input placeholder="请输入姓名" v-model="member.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" prop="phone">
          <el-input placeholder="请输入电话" v-model="member.phone" clearable maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="身份证" label-width="120px" prop="idCard">
          <el-input placeholder="请输入身份证" v-model="member.idCard" clearable maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="职位" label-width="120px" prop="job">
          <el-input placeholder="请输入职位" v-model="member.job" clearable></el-input>
        </el-form-item>
        <el-form-item label="年龄" label-width="120px" prop="age">
          <el-input placeholder="请输入年龄" maxlength="2" v-model="member.age" clearable></el-input>
        </el-form-item>
        <el-form-item label="飞行驾龄" label-width="120px" prop="drivingAge">
          <el-input placeholder="请输入飞行驾龄" maxlength="2" v-model="member.drivingAge" clearable></el-input>
        </el-form-item>
        <el-form-item label="app账户注册" label-width="120px" prop="regname">
          <el-input placeholder="请设置app账号" v-model="member.regname" clearable></el-input>
        </el-form-item>
        <el-form-item label="默认密码" label-width="120px">
          <el-input v-model="pwd" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="飞行执照" label-width="120px" v-if="manager">
          <el-select v-model="member.subId" prop="subId">
            <el-option
              v-for="e in subAccounts"
              :key="e.id"
              :value="e.id"
              :label="e.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="飞行执照" label-width="120px">
          <el-button>上传图片</el-button>
        </el-form-item>
        <!-- <el-form-item label="图片与视频" label-width="120px" class="upload">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :show-file-list="true"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :file-list="fileList">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddFlyer">取 消</el-button>
        <el-button type="primary" @click="confirmAddFlyer">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除团队 -->
    <el-dialog
      title="删除团队"
      :visible.sync="isDelTeam"
      :show-close="false"
      :close-on-click-modal="false"
      width="480px"
      center>
      <p>您确定要删除此团队吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelTeam = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelTeam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除飞手 -->
    <el-dialog
      title="删除飞手"
      :visible.sync="isDelFlyer"
      :show-close="false"
      :close-on-click-modal="false"
      width="480px"
      center>
      <p>您确定要删除此成员吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelFlyer = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelFlyer">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑飞手信息 -->
    <el-dialog
      title="编辑飞手信息"
      :visible.sync="isEditFlyer"
      :show-close="false"
      :close-on-click-modal="false"
      width="780px"
      center>
      <el-form :inline="true" ref="ruleForm" :model="editFlyer" :rules="rules" :label-position="'right'" class="mb40">
        <el-form-item label="姓名" label-width="120px" prop="name">
          <el-input placeholder="请输入姓名" v-model="editFlyer.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" prop="phone">
          <el-input placeholder="请输入电话" v-model="editFlyer.phone" clearable maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="身份证" label-width="120px" prop="idCard">
          <el-input placeholder="请输入身份证" v-model="editFlyer.idCard" clearable maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="职位" label-width="120px" prop="job">
          <el-input placeholder="请输入职位" v-model="editFlyer.job" clearable></el-input>
        </el-form-item>
        <el-form-item label="年龄" label-width="120px" prop="age">
          <el-input placeholder="请输入年龄" maxlength="2" v-model="editFlyer.age" clearable></el-input>
        </el-form-item>
        <el-form-item label="飞行驾龄" label-width="120px" prop="drivingAge">
          <el-input placeholder="请输入飞行驾龄" maxlength="2" v-model="editFlyer.drivingAge" clearable></el-input>
        </el-form-item>
        <el-form-item label="app账户注册" label-width="120px" prop="regname">
          <el-input placeholder="请设置app账号" v-model="editFlyer.regname" clearable></el-input>
        </el-form-item>
        <el-form-item label="默认密码" label-width="120px">
          <el-input v-model="pwd" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="飞行执照" label-width="120px" v-if="manager">
          <el-select v-model="editFlyer.subId" prop="subId">
            <el-option
              v-for="e in subAccounts"
              :key="e.id"
              :value="e.id"
              :label="e.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更改团队" label-width="120px">
          <el-select v-model="editFlyer.teamId" prop="teamId">
            <el-option
              v-for="e in allTeams"
              :key="e.id"
              :value="e.id"
              :label="e.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="飞行执照" label-width="120px">
          <el-button>上传图片</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditFlyer = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditFlyer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      accountInfo: [], // 子账号信息
      allFlyers: [], // 所有飞手信息
      allTeams: [], // 所有团队信息
      isAddTeam: false,
      newDialog: false,
      team: {
        name: ''
      },
      isAddFlyer: false,
      member: {
        name: '',
        phone: '',
        idCard: '',
        job: '',
        age: '',
        drivingAge: '',
        regname: '',
        license: '',
        subId: '' // 属于哪个子账号
      },
      pwd: '初始密码123456',
      teams: {},
      teamInfo: [],
      teamInfos: [],
      changeflag: false, // 更改团队名条件
      addMemberId: null,
      flyers: [],
      subAccounts: [], // 所有子账户
      rules: { // 新增飞手飞手必填项
        name: [
          {required: true, message: '请输入飞手姓名', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入飞手手机号码', trigger: 'blur'}
        ],
        idCard: [
          {required: true, message: '请输入飞手身份证', trigger: 'blur'}
        ],
        job: [
          {required: true, message: '请输入飞手职位', trigger: 'blur'}
        ],
        age: [
          {required: true, message: '请输入飞手年龄', trigger: 'blur'}
        ],
        drivingAge: [
          {required: true, message: '请输入飞手驾龄', trigger: 'blur'}
        ],
        regname: [
          {required: true, message: '请设置飞手账户', trigger: 'blur'}
        ]
      },
      isDelTeam: false,
      delTeamId: '',
      isDelFlyer: false,
      delFlyerId: '', // 删除飞手id
      delFlyerTeamId: '', // 删除飞手所属团队的id
      isEditFlyer: false,
      editFlyer: {
        id: '',
        name: '',
        phone: '',
        idCard: '',
        job: '',
        age: '',
        drivingAge: '',
        regname: '',
        license: '',
        subId: '',
        teamId: ''
      }
    }
  },
  created () {},
  mounted () {
    if (this.manager) {
      this.getManagerTeamInfo()
      this.$bus.$on('account', data => {
        this.accountInfo = data
        // console.log(this.accountInfo)
      })
    } else {
      this.getTeamFlyer()
      // this.getSubTeams()
      // this.getFlyer()
    }
    this.$bus.$on('searchCurTeam', id => {
      this.searchCurTeam(id)
    })
  },
  watch: {},
  computed: {
    manager () { // 管理者显示添加账户非管理者隐藏添加账户
      return this.$store.state.userInfo.type === 'manager' ? true : false
    },
    role () {
      return this.$store.getters.role
    },
    auth () {
      return this.$store.getters.auth
    },
    params () {
      return {
        id: this.$store.state.userInfo.ID,
        token: this.$store.state.userInfo.SocketToken
      }
    }
  },
  methods: {
    getTeamFlyer () {
      this.$axios.get(this.api.teamflyers, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.allFlyers = res.Data.flyers
          this.allTeams = res.Data.teams
          this.teamInfo = res.Data.teams
          this.teamInfo.forEach(e => {
            e.flyer = []
            e.show = false
          })
          this.teamInfos = this.teamInfo
          let data = []
          for (let i in res.Data.flyers) {
            data.push(res.Data.flyers[i])
          }
          data.forEach(e => {
            e.show = false
            this.teamInfo.forEach(item => {
              if (e.belongteam_id === item.id) {
                item.flyer.push(e)
              }
            })
          })
        }
      })
    },
    getSubTeams () {
      this.$axios.get(this.api.team, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.teamInfo = res.Data
          this.teamInfo.forEach(e => {
            e.flyer = []
            e.show = false
          })
          this.teamInfos = this.teamInfo
          this.getFlyer()
        }
      })
    },
    getFlyer () { // 子账户获取飞手
      this.$axios.get(this.api.flyers, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          res.Data.forEach(e => e.show = false)
          this.flyers = res.Data
        }
      })
    },
    getManagerTeamInfo () { // 获取管理团队信息（团队，飞手，无人机）
      this.$axios.get(this.api.managerInfo, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.allFlyers = res.Data.flyers
          this.allTeams = res.Data.teams
          this.subAccounts = res.Data.subaccount
          this.allTeams.forEach(e => {
            e.flyer = []
            e.show = false
          })
          this.teamInfo = this.allTeams
          this.teamInfos = this.allTeams
          this.allFlyers.forEach(e => {
            e.show = false
            this.teamInfo.forEach(item => {
              if (e.belongteam_id === item.id) {
                item.flyer.push(e)
              }
            })
          })
        }
      }).catch(err => {})
    },
    searchCurTeam (accountId) { // 罗列当前账户团队
      if (accountId) {
        let arr = []
        this.teamInfos.forEach(e => {
          if (e.manager_id === accountId) {
            arr.push(e)
          }
        })
        this.teamInfo = arr
      } else {
        this.teamInfo = this.teamInfos
      }
    },
    changeTeamName (e) {
      this.changeflag = !this.changeflag
      this.$forceUpdate()
      e.show = true
      if (e.show && !this.changeflag) {
        let data = {
          team_id: e.id,
          team_name: e.name
        }
        this.$axios.post(this.api.changeTeamName, data, {
          params: this.params
        }).then(res => {
          if (res.Status === 0) {
            // this.getSubTeams()
            e.show = false
            this.getTeamFlyer()
            this.$message.success('修改团队名称成功')
          }
        })
      }
    },
    delTeam (id) { // 记录删除团队id
      this.isDelTeam = true
      this.delTeamId = id
    },
    confirmDelTeam () { // 删除团队
      this.$axios.post(this.api.delTeam, {
        id: this.delTeamId
      }, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.getTeamFlyer()
          if (this.manager) {
            this.getManagerTeamInfo()
          }
          this.isDelTeam = false
          this.$message.success('删除团队成功!')
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    cancelAddTeam () { // 取消添加团队
      this.isAddTeam = false
      this.team.name = ''
    },
    confirmAddTeam () { // 添加团队
      // let junior = this.manager ? this.$store.state.userInfo.ID : this.$store.state.userInfo.Manager
      let data = {
        junior_manager_id: this.$store.state.userInfo.Manager, // 管理员id
        manager_id: this.$store.state.userInfo.ID, // 子账户id
        name: this.team.name
      }
      this.$axios.post(this.api.addTeam, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.isAddTeam = false
          this.team.name = ''
          if (this.manager) {
            this.getManagerTeamInfo()
          } else {
            this.getTeamFlyer()
          }
          this.$message.success('添加团队成功！')
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    addFlyerId (id) { // 记录飞手所属的团队id
      this.isAddFlyer = true
      this.addMemberId = id
    },
    cancelAddFlyer () { // 取消添加飞手
      this.isAddFlyer = false
      for (let i in this.member) {
        this.member[i] = ''
      }
    },
    confirmAddFlyer () { // 添加飞手
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            belongteam: this.addMemberId,
            fly_year: this.member.drivingAge * 1,
            idcard: this.member.idCard,
            lic_img: this.member.license,
            name: this.member.name,
            phone: this.member.phone,
            position: this.member.job,
            regname: this.member.regname,
            year: this.member.age * 1,
            sub_id: this.member.subId || this.$store.state.userInfo.ID
          }
          this.$axios.post(this.api.addFlyer, data, {
            params: this.params
          }).then(res => {
            if (res.Status === 0) {
              if (this.manager) {
                this.getManagerTeamInfo()
              } else {
                this.getTeamFlyer()
              }
              this.isAddFlyer = false
              this.$message.success('添加团队飞手成功！')
              for (let key in this.member) {
                this.member[key] = ''
              }
            } else {
              this.$message.error(res.Msg)
            }
          })
        } else {
          return false
        }
      })
    },
    handlePictureCardPreview () {},
    handleAvatarSuccess () {},
    beforeAvatarUpload () {},
    delMember (id) { // 记录要删除的id
      this.delFlyerId = id
      this.isDelFlyer = true
      this.allFlyers.forEach(e => {
        if (e.id === id) {
          this.delFlyerTeamId = e.belongteam_id
        }
      })
    },
    confirmDelFlyer () { // 删除飞手
      let data = {
        id: this.delFlyerId,
        team_id: this.delFlyerTeamId
      }
      this.$axios.post(this.api.delFlyer, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          if (this.manager) {
            // this.getTeamFlyer()
          } else {
            this.getTeamFlyer()
          }
          this.isDelFlyer = false
          this.$message.success('删除飞手成功！')
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    editFlyerInfo (item) { // 更改飞手信息
      // this.editFlyer = item
      this.isEditFlyer = true
      this.editFlyer.id = item.id
      this.editFlyer.name = item.nickname
      this.editFlyer.phone = item.phone
      this.editFlyer.idCard = item.shenfenzheng
      this.editFlyer.job = item.position
      this.editFlyer.regname = item.regname
      this.editFlyer.age = item.year
      this.editFlyer.drivingAge = item.fly_year
      this.editFlyer.license = item.licence_img
      this.editFlyer.subId = item.belong_user_id
      this.editFlyer.teamId = item.belongteam_id
    },
    confirmEditFlyer () { // 确定更新飞手信息
      let data = {
        id: this.editFlyer.id,
        belongteam: this.editFlyer.teamId,
        fly_year: this.editFlyer.drivingAge * 1,
        idcard: this.editFlyer.idCard,
        name: this.editFlyer.name,
        phone: this.editFlyer.phone,
        position: this.editFlyer.job || '飞手',
        regname: this.editFlyer.regname,
        year: this.editFlyer.age * 1,
      }
      this.$axios.post(this.api.updateFlyer, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.getTeamFlyer()
          this.isEditFlyer = false
        } else {
          this.$message.error(res.Data)
        }
      })
    },
    showFlyerInfo (i, index) { // 是否展示飞手信息
      this.$forceUpdate()
      this.teamInfo[i].flyer[index].show = this.teamInfo[i].flyer[index].show ? false : true
      // this.teamInfo[i].flyer[index].show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.detail{
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
    button{
      float: right;
      width: 160px;
      height: 40px;
      margin: 10px 40px 10px;
      line-height: 40px;
      font-size: 26px;
      color: #fff;
      border-radius: 5px;
      background: #169BD5;
    }
  }
  .team-info{
    padding: 10px 40px;
    background: #fff;
    .team-list{
      position: relative;
      height: 230px;
      padding: 20px 30px;
      margin-bottom: 30px;
      font-size: 24px;
      font-weight: 700;
      border: 1px solid #333;
      background: #F3AFB7;
      h4{
        margin-bottom: 20px;
        input{
          width: 220px;
          height: 34px;
          text-indent: 10px;
        }
      }
      ul{
        li{
          float: left;
          position: relative;
          width: 160px;
          margin-right: 20px;
          margin-bottom: 20px;
          .img-item{
            position: relative;
            background: #fff;
            &:hover{
              cursor: pointer;
            }
            img{
              width: 100%;
              height: 132px;
              background: #333;
              border-radius: 50%;
            }
            .operating{
              position: absolute;
              right: 6px;
              bottom: 0;
              .iconfont{
                font-size: 18px;
                color: #333;
              }
            }
          }
          p{
            text-align: center;
          }
          .pernson-info{
            position: absolute;
            top: 50px;
            left: 60px;
            width: 200px;
            padding: 6px 10px;
            font-size: 14px;
            color: #666;
            background: #fff;
            z-index: 999;
            li{
              width: 100%;
              margin-bottom: 6px;
              margin-right: 0;
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
}
</style>
