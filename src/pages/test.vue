<template>
  <div>
    <!-- <div v-for="(e, i) in arr" :key="i">
      <span @click="changeData(e, i)">显示{{e.show}}</span>
    </div> -->
    <!-- <video id="my-player"
      class="video-js vjs-default-skin vjs-big-play-centered"
      preload="auto"
      autoplay
      style="width: 400px;height: 300px;"
      controls
      data-setup='{"html5" : { "nativeTextTracks" : false }}'>
      <source src="videoSrc" type="rtmp/flv">
    </video> -->
    <!-- <p>{{$store.state.count}}</p>
    <div>{{number}}</div>
    <div>{{count}}</div>
    <div>{{isLogin}}</div>
    <div>{{countState}}</div>
    <div>{{num}}</div>
    <div>{{doneNum}}</div>
    <div>{{done}}</div>
    <el-button @click="add">+1</el-button>
    <el-button @click="addAsync" class="shadow">异步+1</el-button> -->
    <div class="video-js">
      <div v-if="videoSrc===''" class="no-video"></div>
      <video-player v-else class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions">
      </video-player>
    </div>
    <button @click="getData">请求</button>
  </div>
</template>

<script>
// import videojs from 'video.js'
// import 'video.js/dist/video-js.css'
// videojs.options.flash.swf = SWF_URL // 设置flash路径，Video.js会在不支持html5的浏览中使用flash播放视频文件
// import 'vue-video-player/src/custom-theme.css'
// import {videoPlayer} from 'vue-video-player'
// import 'videojs-flash'
// import SWF_URL from 'videojs-swf/dist/video-js.swf'
// import 'videojs-contrib-hls.js/src/videojs.hlsjs'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    videoPlayer
  },
  data () {
    return {
      localCount: 1,
      lists: [
        {id: 1, show: false},
        {id: 2, show: false},
        {id: 3, show: false}
      ],
      list: [
        {id: 1},
        {id: 2},
        {id: 3}
      ],
      _id: 'video',
      foodForm: false,
      // arr: []
      videoPlayer: undefined,
      videoSrc: 'rtmp://test.meiyafly.com/live/123456'
    }
  },
  created () {
    // this.$nextTick(() => {
      // this.inlineDataInit()
    // })
  },
  mounted () {
    // this.selectVideo()
    // this.playVideo(this.videoSrc)
  },
  watch: {},
  computed: {
    arr: function() {
      let arr = [...this.list]
      arr.forEach(e => e.show = false)
      return arr
    },
    number () {
      return this.$store.state.count
    },
    ...mapState({
      count: state => state.count,  
      isLogin: state => state.isLogin,
      countState (state) {
        return state.count + this.localCount
      }
    }),
    ...mapState([
      'num'
    ]),
    ...mapGetters([
      'doneNum'
    ]),
    ...mapGetters({
      done: 'doneNum'
    })
  },
  methods: {
    getData () {
      let data = {
        key: '9bdaebf0bd546f571adc4bba825732a0'
      }
      this.$axios.get('https://restapi.amap.com/v3/ip?', data).then(res => {
        console.log(res)
      }).catch(err => {})
    },
    playVideo (url) {
      this.player = this.CreatePlayer(this.$refs.videoLxf)
      this.player.src({
        src : url,
        type: 'rtmp/flv',
        autoplay: true,
        isFullscreen: true
      })
    },
    CreatePlayer (id) {
      var options = {
        autoplay : true,
        preload : true,
        falsh: {
          swf: './lib/video-js.swf'
        }
      }
      let self = this;
      return videojs(id, options, function onPlayerReady() {
        videojs.log(`Your player${self.index} is ready!`);
        // How about an event listener?
        this.on('ended', function() {
          videojs.log('Awww...over so soon?!');
        })
        this.on('error', function() {
          console.log('error');
        })
        this.on("abort", function() {
          console.log("abort");
        })
        this.on("emptied", function() {
          console.log("emptied");
        })
        this.on('loadstart', () => {
          self.player.play();
        })
        this.on('stalled ', function() {
          console.log("stalled");
        })
      })
    },
    selectVideo() {
      this.videoSrc = 'rtmp://10.74.20.123/live/record1'
      const videoPlayer = videojs('my-player') // 关联video标签的id
      videoPlayer.src({
        src: this.videoSrc,
        type: 'rtmp/flv'
      })
      videoPlayer.play()
    },
    inlineDataInit () {
      // this.list.forEach(e => e.show = false)
      this.arr = [...this.list]
      this.arr.forEach(e => e.show = false)
      // this.list.forEach(e => {
      //   this.$set(e, 'show', false)
      // })
    },
    changeData (e, i) {
      if (e.show) {
        e.show = false
        return false
      }
      this.arr.forEach(item => item.show = false)
      this.$nextTick(() => {
        e.show = true
      })
    },
    uploadImg(res, file) {
      console.log(res.status)
      if (res.status == 1) {
        this.foodForm.image_path = res.image_path;
      }else{
        this.$message.error('上传图片失败！');
      }
    },
    beforeImgUpload(file) {
      const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isRightType) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isRightType && isLt2M;
    },
    ...mapMutations({
      addOne: 'increment' // this.addOne()
    }),
    ...mapMutations([
      'increment'
    ]),
    ...mapActions({
      addInc: 'incAsync'
    }),
    ...mapActions([
      'incAsync'
    ]),
    add () {
      this.$store.commit('increment')
    },
    addAsync () {
      // this.$store.dispatch('incAsync', { amount: 10 })
      this.$store.dispatch('actionA').then(() => {
        console.log(6)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.active-posi{
  color: #e4bf71;
}
</style>
