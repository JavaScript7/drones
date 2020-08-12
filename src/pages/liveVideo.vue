<template>
  <div class="live">
    <div class="video-full-area">
      <div class="title disline">当前直播用户：{{activeFlyer}}</div>
      <button class="close-btn" @click="closeWindow">关闭</button>
      <video
        style="width: 100%; height: 100%; color: black;"
        class="video-js vjs-big-play-centered video-live" autoplay controls preload="auto" data-setup="{}">
        <source :src="liveSrc" type="rtmp/mp4"/>
      </video>
      <button class="shot-pic video-btn" @click="screenPic">截 图</button>
      <!-- <button class="video-down video-btn" @click="startRecording">{{!isRecording ? '录 像' : '结束录像'}}</button> -->
      <button class="video-down video-btn" @click="startRecord">{{!isRecording ? '录 像' : '结束录像'}}</button>
    </div>
  </div>
</template>

<script>
// import video from "video.js"
// import "video.js/dist/video-js.min.css"
// video.options.flash.swf = '../static/js/video-js.swf'
import RecordRTC from 'recordrtc'
import html2canvas from 'html2canvas' // 截图
export default {
  // components: {
  //   videoPlyer
  // },
  data () {
    return {
      fullscreen: false,
      ws: null,
      video: null,
      activeFlyer: '',
      events: ['fullscreenchange'],
      isRecording: false, // 是否录像
      recorder: '',
      fullscreen: false,
      screenName: '', // 截图名字
      imgUrl: '',
      screenshoted: false,
      stream: null,
      liveSources: []
    }
  },
  created () {
    this.fullScreen()
  },
  mounted () {
    this.$bus.$on('father', data => {
      console.log(15)
      console.log(data)
    })
    // this.$bus.$on('liveOnline', data => { // 直播上线 {"type":30004,"payload":{"flyer_id":3}}
    //   this.$forceUpdate()
    //   let arr = []
    //   arr.push({src: 'rtmp://8.129.9.170:1935/live/flyer_' + data})
    //   let obj = {}
    //   let deWeightFour = arr => {
    //     arr = arr.reduce(function(a, b) {
    //       obj[b.src] ? '' : obj[b.src] = true && a.push(b)
    //       return a
    //     }, [])
    //     return arr
    //   }
    //   this.liveSources = deWeightFour(arr)
    //   if (this.liveSources.length !== 0) {
    //     this.isLive = true
    //   } else {
    //     this.isLive = false
    //   }
    //   console.log('直播上线')
    //   console.log(this.liveSources)
    // })
    this.activeFlyer = this.liveSrc.substring(35)
    this.$bus.$on('liveOffine', data => { // 直播下线
      console.log('直播下线2')
      console.log(this.liveSrc.substring(35))
      if (this.liveSrc.substring(35)*1 === data) {
        this.isLive = false
      } else {
        this.isLive = true
      }
    })
  },
  watch: {},
  computed: {
    params () {
      return {
        id: this.$store.state.userInfo.ID,
        token: this.$store.state.userInfo.SocketToken
      }
    },
    liveSrc () { // 当前直播地址
      // return 'rtmp://8.129.9.170:1935/live/flyer_16'
      // return this.$route.params.src
      return ''
    }
  },
  methods: {
    startRecord () { // 直播录制
      this.isRecording = !this.isRecording
      let data = {
        manager_id: this.$store.state.userInfo.ID,
        name: '视频'
      }
      console.log(data)
      if (this.isRecording) {
        this.$axios.post(this.api.recordStart, data, {
          params: this.params
        }).then(res => {
          console.log(res)
        })
      } else {
        this.$axios.post(this.api.recordEnd, data, {
          params: this.params
        }).then(res => {
          console.log(res)
        })
      }
    },
    fullScreen () { // 全屏
    },
    closeWindow () { // 关闭窗口
      window.close()
    },
    captureCamera(callback) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(camera) {
            callback(camera);
        }).catch((error) => {
            this.$message.error('未找到视频设备');
        });
    },
    startRecording () { // 开始录像
      const constraints = {
        auto: true,
        video: true
      }
      if (this.isRecording) {
        this.stopRecording()
      } else {
        navigator.mediaDevices.getUserMedia({
          auto: false,
          video: true
        }).then(stream => {
          this.video.srcObject = screen
          this.recorder = RecordRTC(screen, {
            type: 'video',
            mimeType: 'video / webm; codecs = h264',
          })
          this.recorder.startRecording()
          this.recorder.screen = screen
          this.isRecording = true
        })
      }
      // this.startVideo()
    },
    startVideo () {
      if (this.isRecording) {
        this.stopRecording()
      } else {
        this.captureScreen(screen=>{
          this.video.srcObject = screen
          this.recorder = RecordRTC(screen, {
            type: 'video',
            mimeType: 'video / webm; codecs = h264',
          })
          this.recorder.startRecording()
          this.recorder.screen = screen
          this.isRecording = true
        })
      }
    },
    keepStreamActive (stream) {
      let videoArea = document.querySelector('.video-full-area')
      videoArea.muted = true
      // setSrcObject是来自于RecordRTC.js的全局方法，将stream设置为传入元素的src，实时预览
      setSrcObject(stream, videoArea)
    },
    captureScreen (callback) {
      this.invokeGetDisplayMedia((screen) => {
        // this.addStreamStopListener(screen, () => {})
        callback(screen)
      }, function (error) {
      })
      // navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(camera) {
      //   callback(camera)
      // }).catch((error) => {
      //   this.$message.error('未找到视频设备')
      // })
    },
    invokeGetDisplayMedia (success, error) {
      let displaymediastreamconstraints = {
        video: {
          displaySurface: 'monitor', // monitor, window, application, browser
          logicalSurface: true,
          cursor: 'always' // never, always, motion
        }
      }
      displaymediastreamconstraints = {
        video: this.$refs.videoArea
      }
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      } else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      }
    },
    addStreamStopListener (stream, callback) {
      stream.addEventListener('ended', function () {
        callback()
        callback = function () { }
      }, false)
      stream.addEventListener('inactive', function () {
        callback()
        callback = function () { }
      }, false)
      stream.getTracks().forEach(function (track) {
        track.addEventListener('ended', function () {
          callback()
          callback = function () { }
        }, false)
        track.addEventListener('inactive', function () {
          callback()
          callback = function () { }
        }, false)
      })
    },
    stopRecording () { // 停止录像
      // this.isRecording = false
      this.recorder.stopRecording(this.stopRecordingCallback)
    },
    stopRecordingCallback () { // 下载录像
      let video = this.$refs.videoArea
      video.src = video.srcObject = null
      video.src = URL.createObjectURL(this.recorder.getBlob())
      console.log(video.src)
      let downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(this.recorder.getBlob())
      downloadLink.download = "录屏.mp4"
      downloadLink.click()
      this.recorder.screen.stop()
      this.recorder.destroy()
      this.recorder = null
      this.isRecording = false
    },
    screenPic () {
      let videoArea = document.querySelector('.video-full-area')
      let video = document.querySelector('video')
      var canvas = document.getElementById("localcanvas");
      var ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return false
      let live = document.getElementsByClassName('live')[0]
      let player = document.getElementsByClassName('vjs-text-track-display')[0]
      let demo = document.getElementById('demo')
      // let canvas = document.querySelector('#canvas')
      // let ctx = canvas.getContext('2d')
      // console.log(player)
      // ctx.drawImage(player, 0, 0, canvas.width, canvas.height)
      return false
      window.scrollTo(0, 0) // 防止截图不完整
      this.$nextTick(() => {
        html2canvas(document.querySelector('.video-full-area'), {
          cross: true,
          backgroundColor: null // null 表示设置背景为透明色
        }).then(canvas => {
          this.imgUrl = canvas.toDataURL('image/png', 1.0) // 将图片转为base64, 0-1 表示清晰度
          // this.imgUrl = this.imgUrl.toString().substring(imgBlob.indexOf(",") + 1) // 截取base64以便上传
          console.log(this.imgUrl)
          let eleLink = document.createElement('a')
          eleLink.href = this.imgUrl
          eleLink.download = this.screenName || '气体检测图'
          document.body.appendChild(eleLink)
          eleLink.click()
          document.body.removeChild(eleLink)
          // this.cancel()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.live{
  width: 100vw;
  height: 100vh;
  .video-full-area{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    // height: 90%;
    .title{
      position: absolute;
      top: 10px;
      padding: 10px 26px;
      text-align: center;
      font-size: 20px;
      color: #333;
      background: #81D3F8;
      z-index: 9999;
    }
    button{
      position: absolute;
      top: 10px;
      right: 60px;
      padding: 10px 26px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      border-radius: 10px;
      background: #3D93FD;
      z-index: 9999;
      opacity: .3;
      &:hover{
        opacity: 1;
      }
    }
    .video-btn{
      position: absolute;
      top: 72%;
      width: 120px;
      height: 120px;
      font-size: 28px;
      border-radius: 50%;
      opacity: .3;
      z-index: 9999;
      &:hover{
        opacity: 1;
      }
    }
    .shot-pic{
      right: 200px;
      color: #fff;
      background: #585AA3;
    }
    .video-down{
      right: 60px;
      color: #FFFF80;
      background: #92101C;
    }
    .video-live{
      width: 100vw;
      height: 100vh;
    }
  }
  #canvas{
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 0;
  }
}
</style>