<template>
  <div>
    <div class="contain clearfix">
      <div class="nav">
        <div class="title">账户列表</div>
        <ul>
          <li v-for="e in accounts" :key="e.id" @click="selectActAccount(e.id)">{{e.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      accounts: []
    }
  },
  created () {},
  mounted () {
    this.getAccounts()
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
    }
  },
  methods: {
    getAccounts () {
      this.$axios.get(this.api.managerInfo, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.accounts = res.Data.subaccount
        }
      })
    },
    selectActAccount (id) {
      // this.$bus.$emit('')
    }
  }
}
</script>

<style lang="scss" scoped>
.contain{
  height: 857px;
  // overflow: hidden;
  .nav{
    float: left;
    width: 260px;
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
        color: #A9A9A9;
        font-size: 16px;
        &:hover{
          cursor: pointer;
        }
      }
    }
  }
}
</style>
