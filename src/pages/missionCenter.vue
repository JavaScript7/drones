<template>
  <div class="mission">
    <router-link to="review" tag="div" class="review title">审阅</router-link>
    <router-link to="distribute" tag="div" class="distrbute title" v-if="auth">派发</router-link>
    <router-view :types="taskTypes"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      taskTypes: []
    }
  },
  created () {},
  mounted () {
    this.getTaskType()
  },
  watch: {},
  computed: {
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
    getTaskType () {
      this.$axios.get(this.api.taskTypes, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.taskTypes = res.Data
        } else {
          console.log(res.Msg)
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.mission{
  padding: 20px;
  font-size: 0;
  .title{
    display: inline-block;
    width: 220px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 26px;
    color: #000;
    border: 1px solid #797979;
    &:hover{
      cursor: pointer;
    }
  }
  .review{
    background-color: #F59A23;
  }
  .distrbute{
    background-color: #02A7F0;
  }
}
</style>
