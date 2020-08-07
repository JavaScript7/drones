<template>
  <div class="head">
    <div class="logo">
      <img src="../../../static/img/logo.png" alt="">
      <div class="title">无人机数据综合管理</div>
    </div>
    <ul class="nav">
      <li>首页</li>
      <li>实时巡查</li>
      <li>任务中心</li>
      <li>数据中心</li>
      <li>团队管理</li>
    </ul>
    <div class="acount">
      <div class="info">{{nickName}}</div>
      <div class="reset">设置</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created () {},
  mounted () {
    console.log('headNav')
  },
  watch: {},
  computed: {
    nickName () {
      return this.$store.state.userInfo.Nickname
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.head{
  .logo{
    float: left;
    img{
      width: 40px;
      height: 40px;
    }
    .title{
      color: #333;
    }
  }
  .nav{
    float: left;
    li{
      float: left;
      margin: 0 10px;
    }
  }
  .acount{
    float: right;
  }
}
</style>
