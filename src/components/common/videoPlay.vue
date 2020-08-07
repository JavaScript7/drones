<template>
  <div class="player">
    <video
      style="width: 100%; height: 100%; color: black;"
      class="video-js vjs-big-play-centered video-live" autoplay controls preload="auto" data-setup='{techOrder: ["flash","html5"]}'>
      <source :src="liveSrc" type="rtmp/mp4"/>
    </video>
    <!-- <embed
      width="300"
      height="70"
      class="openFlash"
      style="position:absolute;top:130px;left:225px;z-Index:9999;"
      type="application/x-shockwave-flash"> -->
  </div>
</template>

<script>
export default {
  props: ['src'],
  data () {
    return {}
  },
  mounted () {
    this.flashChecker()
    // console.log(this.liveSrc)
  },
  computed: {
    liveSrc () {
      return this.src
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
    flashChecker () {
      var hasFlash = 0;         //是否安装了flash
      var flashVersion = 0; //flash版本
      var isIE = /*@cc_on!@*/0;      //是否IE浏览器
      if (isIE) {
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
          hasFlash = 1;
          VSwf = swf.GetVariable("$version");
          flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
      } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
          var swf = navigator.plugins["Shockwave Flash"];
          if (swf) {
            hasFlash = 1;
            var words = swf.description.split(" ");
            for (var i = 0; i < words.length; ++i) {
              if (isNaN(parseInt(words[i]))) continue;
              flashVersion = parseInt(words[i]);
            }
          }
        }
      }
      return {f: hasFlash, v: flashVersion};
    },
  }
}
</script>