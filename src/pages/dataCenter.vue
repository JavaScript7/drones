<template>
  <el-container class="data-center">
    <el-aside class="contain clearfix" width="260px" v-if="manager">
      <div class="nav">
        <div class="title">账户列表</div>
        <ul>
          <li v-for="e in accounts" :key="e.id" @click="selectActAccount(e.id)">{{e.name}}</li>
        </ul>
      </div>
    </el-aside>
    <el-main class="data-nav">
      <ul>
        <router-link
          v-for="e in navList"
          :key="e.id"
          :to="e.path"
          tag="li"
          :class="activePath === e.path ? 'active' : ''">
          {{e.value}}
        </router-link>
      </ul>
      <div class="data-content">
        <router-view :selectAccount="curAccount" :myName="myName"></router-view>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import SideBar from '../components/common/sidebar'
export default {
  components: {
    SideBar
  },
  data () {
    return {
      accounts: [],
      curAccount: '', // 当前账号id
      navList: [
        {id: 0, value: '图片', path: '/picture'},
        {id: 1, value: '视频', path: '/video'},
        {id: 2, value: '飞行统计', path: '/statistics'},
        {id: 3, value: '飞行日志', path: '/flightLog'}
      ],
      myName: ''
    }
  },
  created () {
    if (this.manager) {
      this.getAccounts()
    }
  },
  mounted () {
    setTimeout(() => {
      this.myName = 'jkl'
    }, 2000)
  },
  watch: {},
  computed: {
    manager () {
      return this.$store.state.userInfo.type === 'manager' ? true : false
    },
    params () {
      return {
        id: this.$store.state.userInfo.ID,
        token: this.$store.state.userInfo.SocketToken
      }
    },
    activePath () {
      return this.$route.path
    }
  },
  methods: {
    getAccounts () {
      this.$axios.get(this.api.managerInfo, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.accounts = res.Data.subaccount
          this.curAccount = this.accounts[0].id
        }
      })
    },
    selectActAccount (id) {
      this.curAccount = id
    }
  }
}
</script>

<style lang="scss" scoped>
.data-center{
  display: flex;
  position: relative;
  // min-width: 1200px;
  .contain{
    flex-shrink: 0;
    // float: left;
    width: 260px;
    min-height: 857px;
    // overflow: hidden;
    .nav{
      height: 100%;
      text-align: center;
      background: #555;
      .title{
        line-height: 60px;
        color: #A9A9A9;
        font-size: 30px;
      }
      ul{
        li{
          height: 36px;
          line-height: 36px;
          color: #A9A9A9;
          font-size: 16px;
          &:hover{
            cursor: pointer;
          }
        }
      }
    }
  }
  .data-nav{
    // position: absolute;
    // position: absolute;
    // right: 0;
    // top: 0; 
    width: 100%;
    // padding-left: 260px;
    // overflow: hidden;
    ul{
      width: 480px;
      height: 40px;
      margin: 0 auto;
      .active{
        color: #E4BF71;
      }
      li{
        float: left;
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        color: #000;
        &:hover{
          cursor: pointer;
        }
      }
    }
    .data-content{}
  }
}
</style>
