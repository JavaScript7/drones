<template>
  <div class="picture">
    <div class="content">
      <el-form :inline="true" :model="form" class="form">
        <!-- <el-form-item label="选择时间:">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择成员:">
          <el-select v-model="form.selectValue" clearable>
            <el-option
              v-for="e in members"
              :key="e.id"
              :label="e.value"
              :value="e.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-upload2" class="upload-file" @click="openOpload">
            上传
            <!-- <input type="file" id="file" name="file" class="upload-files" ref="uploadFile" @change="uploadFile($event)" /> -->
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newAddFolder" v-show="!curPath">新建文件夹</el-button>
        </el-form-item>
      </el-form>
      <ul class="box path-list">
        <li v-show="isPicture">全部文件</li>
        <li v-show="!isPicture" class="goback" @click="goBackPrevious">返回上一级</li>
        <li v-show="!isPicture" style="padding: 0 4px;">|</li>
        <li v-show="!isPicture">{{curPath}}</li>
      </ul>
      <div class="file-box" v-if="!curPathShow" v-loading="listLoading">
        <dd class="g-clearfix file-dd open-enable"
          v-for="e in files" :key="e.id">
          <div style="height: 44px;line-height: 44px;">
            <div class="file-type dir-small"></div>
            <a href="javascript:void(0);" class="txt" v-show="!e.show" @click="getCurSubAcccountPath(e.path)">{{e.path}}</a>
            <input type="text" class="change-name" v-if="e.type === 'file'" v-show="e.show" v-model="e.path">
            <img class="img disline" v-if="e.type === 'pic'" :src="e.url" alt="">
            <span class="pic-add disline" v-show="e.show">
              <span class="disline" @click="confirmAddFile(e)">√</span>
              <span class="disline" @click="cancelAddFile(e)">×</span>
            </span>
            <span class="file-del iconfont icon-iconfontshanchu5" title="删除" @click="delFile(e.id)"></span>
          </div>
        </dd>
      </div>
      <div class="file-ff" v-else v-loading="loading">
        <dd class="g-clearfix file-dd open-enable"
          v-for="imgItem in curPathData" :key="imgItem.id">
          <div style="height: 44px;line-height: 44px;padding-left: 36px;">
            <!-- <input type="checkbox" v-if="imgItem.type === 'file'"> -->
            <div class="file-type pic-small disline"></div>
            <a href="javascript:void(0);" class="txt" @click="openPictureShow(imgItem.url)">{{imgItem.name}}</a>
            <input type="text" class="change-name" v-if="imgItem.type === 'file'" v-show="imgItem.show" v-model="imgItem.path">
            <!-- <img class="img disline" :src="imgItem.url" alt=""> -->
          </div>
        </dd>
      </div>
      <div>
      <!-- <ul>
        <li v-for="e in imgLists" :key="e.id">
          <div class="list">
            <div class="list-top clearfix">
              <div class="left">{{e.date}} {{e.name}} {{e.title}}</div>
              <div class="right">
                <el-button type="primary" size="small" icon="el-icon-download" title="下载"></el-button>
                <el-button type="primary" size="small" icon="el-icon-delete" title="删除" @click="getUploadPicVideo"></el-button>
                <el-button type="primary" size="small" icon="el-icon-upload2" title="显示隐藏"></el-button>
              </div>
            </div>
            <div class="list-img">
              <img v-for="img in e.imgs" :key="img.id" :src="img.url" alt="" @click="ZoomImg(img.url)">
            </div>
          </div>
        </li>
      </ul> -->
      </div>
    </div>
    <div class="zoom-img" v-show="isActiveImg">
      <img :src="activeImg" alt="" @click="isActiveImg = false">
    </div>
    <!-- 大图片显示 -->
    <el-dialog
      title="图片"
      :visible.sync="ishowImg"
      :show-close="true"
      :close-on-click-modal="false"
      width="30%"
      center>
      <img class="img-show" :src="showActiveImg" alt="">
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="ishowImg = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button> -->
      </span>
    </el-dialog>
    <!-- 上传图片 -->
    <el-dialog
      title="上传图片"
      :visible.sync="isUploadPic"
      :show-close="true"
      :close-on-click-modal="false"
      width="30%"
      center>
      <el-form :inline="true" :model="uploadPic" :label-position="'right'" class="mb40">
        <el-form-item label="上传时间" label-width="120px">
          <el-date-picker
            v-model="uploadPic.time"
            align="right"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="上传文件目录" label-width="120px">
          <el-input placeholder="请输入上传文件目录" v-model="uploadPic.name"></el-input>
        </el-form-item> -->
        <el-form-item label="选择文件" label-width="120px">
          <el-button type="primary" class="upload-file" @click="confirmDelUpload">
          选择文件
          <input type="file" id="file" name="file" class="upload-files" ref="uploadFile" @change="uploadFile($event)" />
        </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUploadFile">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除文件"
      :visible.sync="isDelFile"
      :show-close="false"
      :close-on-click-modal="false"
      width="480px"
      center>
      <p>您确定要删除此文件吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelFile = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelFile">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['selectAccount', 'myName'],
  data () {
    return {
      isPicture: true,
      listLoading: false,
      loading: false,
      form: {
        time: '',
        selectValue: ''
      },
      isAllFile: true,
      // files: [
      //   {id: 0, name: '飞手1', show: false, type: 'file'},
      //   {id: 1, name: '飞手2', show: false, type: 'file'},
      //   {id: 2, name: '飞手3', show: false, type: 'file'},
      //   {id: 3, name: '图片1', url: 'https://pan.baidu.com/box-static/file-widget-1/common/Picture_24_942ff50.png?__sprite', show: false, type: 'pic'}
      // ],
      files: [],
      fileInfos: [],
      curAccount: '', // 当前选择的账号
      allPath: [], // 所有目录
      curPath: '', // 当前目录名称
      curPathShow: false, // 显示当前目录
      curPathData: [], // 当前目录下的文件
      members: [
        {id: 0, value: '飞手1'},
        {id: 1, value: '飞手2'},
        {id: 2, value: '飞手3'},
        {id: 3, value: '飞手4'}
      ],
      imgLists: [
        {id: 0, date: '2020-05-06', name: '飞手1', title: '拍摄图片', imgs: [
          {id: 0, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 1, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 2, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 3, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 4, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 5, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 6, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 7, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 8, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'}
        ]},
        {id: 1, date: '2020-05-06', name: '飞手2', title: '拍摄图片', imgs: [
          {id: 0, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 1, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'}
        ]}
      ],
      isActiveImg: false,
      activeImg: '',
      resData: null, // 阿里云服务端签名直传数据
      file: null,
      isNewFolder: false,
      addFlag: true, // 能否新建（过滤新建后没填写信息而再点击新建）
      showActiveImg: '',
      ishowImg: false,
      isUploadPic: false, // 是否上传图片
      uploadPic: {
        time: '',
        name: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      isDelFile: false,
      delId: ''
    }
  },
  created () {},
  mounted () {
    // this.getFilePath()
    this.getAllFilePath()
    // console.log(this.curAccount)
    // console.log(this.myName)
  },
  watch: {
    selectAccount (val) {
      this.curAccount = val
    }
  },
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
    openPicture () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.isPicture = false
      }, 500)
    },
    openPictureShow (src) {
      this.showActiveImg = src
      this.ishowImg = true
    },
    getOssInfo (name) {
      let url = ''
      this.$axios.get(this.api.aliOssUrl).then(res => {
        console.log(res)
        let host = res.host // http://xmazd-dim.oss-cn-shenzhen.aliyuncs.com
        url = host + name + '.png'
        console.log(url)
      })
    },
    getAllPathFile (path) {
      let data = { // 1595302865446drone.jpg
        path
      }
      this.$axios.post(this.api.ossPathFile, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          // this.files = []
          // res.Data.forEach(e => {
          //   this.files.push({name: e.name, show: false, type: 'file', url: e.url})
          // })
          // console.log(this.files)
          this.fileInfos = res.Data
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    openOpload () { // 开启上传文件
      if (this.curPath) {
        this.isUploadPic = true
      } else {
        this.$message.error('请先选择上传的文件目录')
      }
    },
    uploadFile (e) { // 2020-5-5 飞手1
      let file = e.target.files[0]
      this.$axios.get(this.api.aliOssUrl).then(res => {
        let filename = new Date().getTime() + file.name
        // console.log(file)
        // return false
        let form = new FormData()
        form.append('name', file.name)
        form.append('key', this.curPath + '/' + this.uploadPic.time)
        form.append('policy', res.policy)
        form.append('OSSAccessKeyId', res.accessid)
        form.append('success_action_status', 200)
        form.append('callback', res.callback)
        form.append('signature', res.signature)
        form.append('file', file)
        this.$axios.post(res.host, form).then(res => {
          if (res.Status === 'OK') {
            this.cancelUploadFile()
            this.getFilePath(this.curPath)
            this.$message.success('上传成功！')
          } else {
            this.$message.error(res.Msg)
          }
        })
      })
    },
    cancelUploadFile () {
      this.isUploadPic = false
      this.uploadPic.time = this.uploadPic.name = ''
    },
    confirmDelUpload () {},
    getAllFilePath () {
      this.$axios.get(this.api.ossFilePath, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          res.Data.forEach(e => {
            e.show = false
            e.type = 'file'
          })
          this.allPath = res.Data
          this.files = res.Data.filter(e => {
            return e.parent === 0
          })
          // console.log(this.files)
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    getCurSubAcccountPath (path) {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
        this.curPath = path
        this.curPathShow = true
        this.isPicture = false
        this.getFilePath(this.curPath)
      }, 500)
    },
    getFilePath (path) { // 获取当前目录路径下的所文件
      this.$axios.post(this.api.ossPathFile, { path }, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          res.Data.forEach(e => e.show = false)
          this.files.forEach(e => e.data = [])
          // this.files.forEach(e => e.type = 'pic')
          // this.files.forEach(e => {
          //   if (e.path === path) {
          //     e.data = res.Data
          //   }
          // })
          this.curPathData = res.Data
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    newAddFolder () { // 启动新建文件夹
      let lastId = this.files.length === 0 ? 1 : this.files[this.files.length - 1].id + 1
      if (this.addFlag) {
        this.files.push({id: lastId, name: '', show: true, type: 'file'})
        this.$nextTick(() => {
          let input = document.querySelectorAll('.change-name')
          let len = input.length - 1
          input[len].focus()
        })
        this.addFlag = false
      } else {
        this.files.pop()
        this.addFlag = true
      }
    },
    confirmAddFile (e) { // 确认新建文件夹
      let data = {
        parent: 0,
        path: e.path,
        user_id: this.$store.state.userInfo.ID
      }
      this.$axios.post(this.api.ossFileCreate, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          e.show = false
          this.addFlag = true
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    cancelAddFile (e) { // 取消新建文件夹
      e.show = false
      if (!this.addFlag) {
        this.files.pop()
      }
      this.addFlag = true
    },
    changeName (e) { // 更改文件夹名称
      e.show = e.type === 'file' ? true : false
      if (e.type === 'file') {
        // e.show = true
      } else {
        e.show = false
        this.showActiveImg = e.url
        this.ishowImg = true
      }
    },
    goBackPrevious () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.isPicture = true
        this.curPathShow = false
        this.curPath = ''
      }, 500)
      // this.isAllFile = !this.isAllFile
    },
    onSearch () {},
    ZoomImg (url) {
      this.isActiveImg = true
      this.activeImg = url
    },
    upload (e) {
      this.file = e.target.files[0]
      this.$axios.get(this.api.aliOssUrl).then(res => {
        this.resData = res
        this.uploadPicVideo()
      })
    },
    uploadPicVideo () { // 上传
      let filename = new Date().getTime() + this.file.name
      let form = new FormData()
      form.append('name', this.file.name)
      form.append('key', filename)
      form.append('policy', this.resData.policy)
      form.append('OSSAccessKeyId', this.resData.accessid)
      form.append('success_action_status', 200)
      form.append('callback', this.resData.callback)
      form.append('signature', this.resData.signature)
      form.append('file', this.file)
      this.$axios.post(this.resData.host, form).then(res => {
        console.log(res)
      })
    },
    getUploadPicVideo () {
      this.$axios.get(this.api.aliOssUrl).then(res => {
        this.resData = res
        this.$axios.get(res.host, {
          params: {
            Action: 'GetURLUploadInfos'
          }
        }).then(res => {
          console.log(res)
        })
      })
    },
    delFile (id) {
      this.isDelFile = true
      this.delId = id
    },
    confirmDelFile () { // 删除文件夹
      this.$axios.post(this.api.ossDelFile, {
        id: this.delId
      }, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.isDelFile = false
          this.$message.success('删除成功！')
        } else {
          this.$message.error(res.Msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.picture{
  position: relative;
  .content{
    height: 717px;
    padding: 30px;
    ul{
      li{
        .list{
          margin-bottom: 20px;
          .list-top{
            height: 32px;
            margin-bottom: 10px;
            line-height: 32px;
            .left{
              float: left;
            }
            .right{
              float: right;
            }
          }
          .list-img{
            height: 120px;
            padding: 10px;
            border: 1px solid #363;
            img{
              width: 160px;
              height: 120px;
              margin-right: 10px;
              &:hover{
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .zoom-img{
    position: absolute;
    top: 50%;
    left: 20%;
    width: 620px;
    height: 580px;
    transform: translateY(-50%);
    img{
      width: 100%;
      height: 100%;
    }
  }
}

.box{
  border-top-color: #fff;
  height: 36px;
  line-height: 36px;
  color: #888;
  overflow: hidden;
  border-bottom: 1px solid #f2f6fd;
  padding: 0;
  border-bottom: 1px solid #f2f6fd;
  .goback{
    color: #09aaff;
    &:hover{
      cursor: pointer;
    }
  }
}
.path-list{
  li{
    float: left;
  }
}
.file-box{
  height: auto;
  font: 12px/1.5 tahoma,arial;
  .file-dd{
    position: relative;
    height: auto;
    // height: 44px;
    // line-height: 44px;
    border-bottom: 1px solid #f2f6fd;
    white-space: nowrap;
    text-overflow: ellipsis;
    background: #FFF;
    &:hover{
      cursor: pointer;
    }
    .file-del{
      margin-left: 600px;
      color: #409EFF;
    }
  }
  .dir-small {
    width: 26px;
    height: 26px;
    background: url(https://pan.baidu.com/box-static/file-widget-1/sysIcon/img/Folder_24_35f88d9.png?__sprite) center no-repeat;
    // background: url(https://pan.baidu.com/box-static/file-widget-1/common/Picture_24_942ff50.png?__sprite) center no-repeat;
    // background: url(https://pan.baidu.com/box-static/file-widget-1/common/Video_24_94bee9e.png?__sprite) center no-repeat;
  }
  .file-type{
    cursor: default;
    display: block;
    height: 26px;
    width: 26px;
    position: absolute;
    left: 43px;
    top: 10px;
  }
  .txt{
    position: absolute;
    left: 100px;
  }
  .change-name{
    position: absolute;
    // top: 14px;
    left: 80px;
    margin: 9px 0;
    padding: 0 0 0 5px;
    width: 200px;
    height: 24px;
    vertical-align: middle;
    border: 1px solid #C3EAFF;
    background: #fff;
    border-radius: 2px;
  }
  .img{
    vertical-align: middle;
    padding-left: 42px;
  }
  .pic-add{
    position: absolute;
    left: 300px;
    text-align: center;
    span{
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border: 1px solid #09AAFF;
    }
  }
}

.img-show{
  width: 100%;
  height: 100%;
}
.upload-file{
  position: relative;
  overflow: hidden;
  .upload-files{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}

.picture-list{
  position: absolute;
  top: 10px;
  width: 120px;
  height: 40px;
}
.dir-small{
  width: 26px;
  height: 26px;
  vertical-align: middle;
  background: url(https://pan.baidu.com/box-static/file-widget-1/sysIcon/img/Folder_24_35f88d9.png?__sprite) center no-repeat;
  // background: url(https://pan.baidu.com/box-static/file-widget-1/common/Picture_24_942ff50.png?__sprite) center no-repeat;
  // background: url(https://pan.baidu.com/box-static/file-widget-1/common/Video_24_94bee9e.png?__sprite) center no-repeat;
}
.pic-small{
  width: 26px;
  height: 26px;
  vertical-align: middle;
  background: url(https://pan.baidu.com/box-static/file-widget-1/common/Picture_24_942ff50.png?__sprite) center no-repeat;
}
</style>
