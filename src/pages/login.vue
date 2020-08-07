<template>
  <div class="login">
    <div class="title">
      <img src="../../static/img/logo.png" alt="">
      <p>应急管理无人机综合数据平台</p>
    </div>
    <div class="login-panel">
      <h3 class="mb40">欢迎登录</h3>
      <form>
        <div class="posi">
          <span class="iconfont icon-zhanghao" style="color: #999;"></span>
          <input type="text" placeholder="请输入用户名" v-model="name">
        </div>
        <div class="posi">
          <span class="iconfont icon-mima" style="color: #999;"></span>
          <input type="password" placeholder="请输入密码" v-model="password" @enter="loginIn">
        </div>
        <label class="checkbox mb40">
          <span class="input">
            <span :class="isLogin ? 'inner select-inner' : 'inner'"></span>
            <input type="checkbox" v-model="isLogin">
          </span>
          <span class="label">记住密码</span>
        </label>
        <button class="mb40" @click.prevent="loginIn">LOGIN</button>
      </form>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js' // 加密解密
export default {
  data () {
    return {
      name: 'test',
      password: '123456',
      isLogin: false
    }
  },
  created () {},
  mounted () {
    this.getCookie()
  },
  watch: {
    'isLogin': function (val) {
      if (!val) this.clearCookie()
    }
  },
  computed: {},
  methods: {
    loginIn () {
      let data = {
        remember_me: this.isLogin ? 1 : 0,
        user_name: this.name,
        user_pwd: this.password
      }
      this.$axios.post(this.api.login, data).then(res => {
        if (res.Status === 0) {
          sessionStorage.setItem('userInfo', res.Data)
          this.$store.commit('GET_TOKEN', res.Data.SocketToken)
          if (this.isLogin) {
            sessionStorage.setItem('token', res.Data.SocketToken)
            this.setCookie(this.name, this.password, 7) // 账号，密码，保存天数
          } else {
            this.clearCookie()
            sessionStorage.removeItem('token')
          }
          this.$router.push({path: '/home'})
        } else {
          this.$message.error(res.Msg)
        }
      }).catch(err => {})
    },
    setCookie (name, pwd, day) {
      let exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * day) // 保存的天数
      let encryptVal = CryptoJS.AES.encrypt(pwd + '', 'secretkey078').toString() // 加密
      // 字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + name + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
        'userPwd' + '=' + encryptVal + ';path=/;expires=' + exdate.toGMTString()
    },
    getCookie () {
      if (document.cookie.length > 0) {
        let arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (let i = 0; i < arr.length; i++) {
          let arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.name = arr2[1] // 保存到保存数据的地方
            this.isLogin = true
          } else if (arr2[0] === 'userPwd') {
            let decryptVal = CryptoJS.AES.decrypt(arr2[1], 'secretkey078').toString(CryptoJS.enc.Utf8) // 解密
            this.password = decryptVal
          }
        }
      }
    },
    clearCookie () {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  position: relative;
  width: 100%;
  height: 100vh;
  background: url(../../static/img/bg.jpg) no-repeat;
  background-size: 100% 100%;
  .title{
    position: absolute;
    top: 60px;
    left: 60px;
    height: 80px;
    line-height: 80px;
    font-size: 0;
    color: #fff;
    text-align: center;
    img{
      display: inline-block;
      width: 76px;
      height: 80px;
      vertical-align: top;
    }
    p{
      display: inline-block;
      height: 100%;
      margin-left: 20px;
      font-size: 70px;
      font-weight: 800;
    }
  }
  .login-panel{
    position: absolute;
    top: 30%;
    right: 10%;
    padding: 16px 24px;
    background-color: #fff;
    border-radius: 10px;
    h3{
      font-size: 32px;
      color: #626565;
      text-align: center;
    }
    form{
      width: 320px;
      margin: 0 auto;
      .posi{
        position: relative;
        span{
          position: absolute;
          top: 14px;
          left: 14px;
        }
      }
      input[type="text"], input[type="password"]{
        width: 100%;
        height: 40px;
        font-size: 18px;
        text-indent: 40px;
        outline: none;
        margin-bottom: 24px;
        border-radius: 10px;
        border: 1px solid #999;
      }
      .checkbox{
        color: #606266;
        font-weight: 500;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        display: inline-block;
        white-space: nowrap;
        user-select: none;
        margin-right: 30px;
        .input{
          white-space: nowrap;
          cursor: pointer;
          outline: none;
          display: inline-block;
          line-height: 1;
          position: relative;
          vertical-align: middle;
          .inner{
            display: inline-block;
            position: relative;
            border: 1px solid #dcdfe6;
            border-radius: 2px;
            box-sizing: border-box;
            width: 14px;
            height: 14px;
            background-color: #fff;
            z-index: 1;
            transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
            &:after{
              box-sizing: content-box;
              content: "";
              border: 1px solid #fff;
              border-left: 0;
              border-top: 0;
              height: 7px;
              left: 4px;
              position: absolute;
              top: 1px;
              width: 3px;
              transition: transform .15s ease-in .05s;
              transform-origin: center;
              transform: rotate(45deg) scaleY(1);
            }
          }
          .select-inner{
            background-color: #81D3F8;
            border-color:#81D3F8;
          }
          input[type="checkbox"]{
            opacity: 0;
            outline: none;
            position: absolute;
            margin: 0;
            width: 0;
            height: 0;
            z-index: -1;
          }
        }
      }
      button{
        width: 100%;
        height: 40px;
        color: #fff;
        border-radius: 5px;
        background-color: #81D3F8;
      }
    }
  }
}
</style>
