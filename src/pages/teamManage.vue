<template>
  <div class="team">
    <div class="sidebar" v-if="auth">
      <div class="title" @click="searchCurTeamF(false, -1)">账户</div>
      <div class="account-info">
        <ul>
          <li
            v-for="(e, i) in accounts"
            :key="e.id"
            :class="i === activeSubaccount ? 'active-sub' : ''">
            <span class="search-team disline" @click="showAccountInfo(e.id)">
              <img class="avator" src="https://www.amap.com/assets/img/defavatar.png" alt="">
            </span>
            <span class="account-name disline" @click="searchCurTeamF(e.id, i)">{{e.name}}</span>
          </li>
        </ul>
      </div>
      <button class="account" @click="addAccount">添加账户</button>
    </div>
    <div :class="auth ? 'main ml270' : 'main'">
      <ul>
        <router-link to="/memberManage" tag="li" :class="$route.path === '/memberManage' ? 'active' : ''">成员管理</router-link>
        <router-link to="/deviceDetail" tag="li" :class="$route.path === '/deviceDetail' ? 'active' : ''">设备管理</router-link>
        <router-link to="/authManage" tag="li" :class="$route.path === '/authManage' ? 'active' : ''">权限设置</router-link>
      </ul>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
    <!-- 添加新的子账号 -->
    <el-dialog
      title="新增"
      :visible.sync="addAccountDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="600px"
      center>
      <el-form :inline="true" :model="account" :label-position="'right'" class="mb40">
        <el-form-item label="账号账户:" label-width="120px">
          <el-input placeholder="请输入账号" v-model="account.regname" clearable minlength="6"></el-input>
        </el-form-item>
        <el-form-item label="账号密码:" label-width="120px">
          <el-input type="password" placeholder="请输入账号密码" v-model="account.passwd" clearable minlength="6"></el-input>
        </el-form-item>
        <el-form-item label="账号昵称:" label-width="120px">
          <el-input placeholder="请输入账号昵称" v-model="account.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号地区:" label-width="120px">
          <el-select
            v-model="account.province"
            @change="selectCity"
            placeholder="请选择省份"
            class="province-city-area">
            <el-option
              v-for="e in provinces"
              :key="e.class_id"
              :label="e.class_name"
              :value="e.class_id">
            </el-option>
          </el-select>
          <el-select
            v-model="account.city"
            @change="selectArea"
            placeholder="请选择市级"
            class="province-city-area">
            <el-option
              v-for="e in cities"
              :key="e.class_id"
              :label="e.class_name"
              :value="e.class_id">
            </el-option>
          </el-select>
          <el-select
            v-model="account.area"
            placeholder="请选择地区"
            class="province-city-area">
            <el-option
              v-for="e in areas"
              :key="e.class_id"
              :label="e.class_name"
              :value="e.class_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddccount">取 消</el-button>
        <el-button type="primary" @click="confirmAddAccount">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 账户信息 -->
    <el-dialog
      title="账户信息"
      :visible.sync="showActiveAccount"
      :show-close="false"
      :close-on-click-modal="false"
      width="600px"
      center>
      <!-- <el-form :inline="true" :model="activeAccount" :label-position="'right'" class="mb40">
        <el-form-item label="账号账户:" label-width="120px">
          <el-input placeholder="请输入账号" v-model="activeAccount.regname" clearable minlength="6"></el-input>
        </el-form-item>
      </el-form> -->
      <p class="mb10">登录账号：{{activeAccount.regname}}</p>
      <p class="mb10">账号昵称：{{activeAccount.name}}</p>
      <p class="mb10">账号地区：{{activeAccount.area}}</p>
      <el-popconfirm :title="`您确定要删除账号${activeAccount.regname}吗？`" @onConfirm="delAccount(activeAccount.id)">
        <el-button slot="reference">删除账号</el-button>
      </el-popconfirm>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="showActiveAccount = false">关 闭</el-button> -->
        <el-button @click="showActiveAccount = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      accounts: [],
      showActiveAccount: false,
      activeAccount: {
        id: '',
        name: '',
        regname: '',
        area: ''
      },
      activeSubaccount: -1, // 当前账户，默认-1是管理员账户
      addAccountDialog: false,
      account: {
        name: '',
        passwd: '',
        regname: '',
        province: '',
        city: '',
        area: ''
      },
      provinces: [],
      cities: [],
      areas: []
    }
  },
  created () {},
  mounted () {
    if (this.manager) {
      this.getSubusers()
    }
  },
  watch: {
    '$route': function(newVal) {
      if (newVal.name === 'memberManage' || newVal.name === 'deviceDetail') {
        this.activeSubaccount = -1
      }
    }
  },
  computed: {
    auth () {
      return this.$store.getters.auth
    },
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
    getSubusers () { // 管理者账号下所有的全部子账户
      this.$axios.get(this.api.subusers, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.accounts = res.Data
          this.$bus.$emit('account', this.accounts)
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    showAccountInfo (id) {
      this.showActiveAccount = true
      this.accounts.forEach(e => {
        if (e.id === id) {
          this.activeAccount.id = e.id
          this.activeAccount.name = e.name
          this.activeAccount.regname = e.regname
          this.activeAccount.area = e.area
        }
      })
    },
    delAccount (id) { // 管理员删除子账户
      this.$axios.post(this.api.delSubaccount, {
        id
      }, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.getSubusers()
          this.showActiveAccount = false
          this.$message.success('删除子账号成功！')
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    getProvice () { // 获取省份
      this.$axios.get(this.api.province).then(res => {
        if (res.Status === 0) {
          this.provinces = res.Data
        }
      })
    },
    selectCity () {
      if (this.account.province) {
        this.account.city = this.account.area = ''
      }
      this.$axios.post(this.api.provinceCity, {
        province_id: this.account.province
      }).then(res => {
        if (res.Status === 0) {
          this.cities = res.Data
        }
      })
    },
    selectArea () {
      if (this.account.city) {
        this.account.area = ''
      }
      this.$axios.post(this.api.city, {
        city_id: this.account.city
      }).then(res => {
        if (res.Status === 0) {
          this.areas = res.Data
        }
      })
    },
    addAccount () {
      this.getProvice()
      this.addAccountDialog = true
    },
    cancelAddccount () { // 清空数据
      this.addAccountDialog = false
      for (let i in this.account) {
        this.account[i] = ''
      }
    },
    confirmAddAccount () { // 添加账户
      let {province, city, area} = ''
      this.provinces.forEach(e => {
        if (e.class_id === this.account.province) {
          province = e.class_name
        }
      })
      this.cities.forEach(e => {
        if (e.class_id === this.account.city) {
          city = e.class_name
        }
      })
      this.areas.forEach(e => {
        if (e.class_id === this.account.area) {
          area = e.class_name
        }
      })
      let data = {
        manager: this.$store.state.userInfo.ID,
        name: this.account.name,
        passwd: this.account.passwd,
        regname: this.account.regname,
        area: province + city + area
      }
      if (!data.name && !data.regname && !data.passwd && !data.areas) {
        this.$message.error('请填写完整！')
        return false
      }
      this.$axios.post(this.api.addSubaccount, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.getSubusers()
          this.$message.success('添加子账户成功！')
          this.cancelAddccount()
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    searchCurTeamF (id, index) { // 查看当前团队
      this.activeSubaccount = index
      this.$bus.$emit('searchCurTeam', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.team{
  min-height: 848px;
  padding: 5px 10px;
  background: #7F7F7F;
  :after{
    display: block;
    clear: both;
    overflow: hidden;
  }
  .sidebar{
    float: left;
    position: relative;
    width: 260px;
    height: 800px;
    margin-right: 10px;
    text-align: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: #fff;
    .title{
      height: 60px;
      line-height: 60px;
      font-size: 26px;
      color: #fff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      background: #333;
      &:hover{
        cursor: pointer;
      }
    }
    .account-info{
      position: relative;
      ul{
        padding: 10px 15px;
        .active-sub{
          background: #EBEDF0;
        }
        li{
          height: 36px;
          margin-bottom: 10px;
          line-height: 36px;
          text-align: left;
          .search-team{
            margin-left: 20px;
            cursor: pointer;
            .avator{
              width: 30px;
              height: 30px;
              vertical-align: middle;
            }
          }
          .account-name{
            width: 140px;
            height: 100%;
            margin-left: 20px;
            text-align: left;
            border-radius: 5px;
            cursor: pointer;
          }
        }
      }
      .info{
        position: absolute;
        top: 0;
      }
    }
    .account{
      position: absolute;
      bottom: 0;
      left: 56px;
      width: 50%;
      height: 32px;
      margin-bottom: 20px;
      line-height: 32px;
      border: 1px solid gray;
      border-radius: 10px;
    }
  }
  .ml270{
    margin-left: 270px;
  }
  .main{
    min-height: 800px;
    // overflow: hidden;
    ul{
      height: 60px;
      background: #333;
      li{
        float: left;
        width: 176px;
        height: 100%;
        line-height: 60px;
        text-align: center;
        font-size: 26px;
        color: #fff;
        &:first-child{
          margin-left: 60px;
        }
        &:hover{
          cursor: pointer;
        }
      }
      .active{
        color: #FFFF80;
      }
    }
  }
}
</style>
