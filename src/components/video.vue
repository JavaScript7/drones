<template>
  <div class="video">
    <div class="content">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="选择时间:">
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
        </el-form-item>
      </el-form>
      <ul>
        <li v-for="e in imgLists"
          :key="e.id">
          <div class="list">
            <div class="list-top clearfix">
              <div class="left">{{e.date}} {{e.name}} {{e.title}}</div>
              <div class="right">
                <el-button type="primary" size="small" icon="el-icon-upload2" title="上传"></el-button>
                <el-button type="primary" size="small" icon="el-icon-download" title="下载"></el-button>
                <el-button type="primary" size="small" icon="el-icon-delete" title="删除"></el-button>
                <el-button type="primary" size="small" icon="el-icon-upload2" title="显示隐藏"></el-button>
              </div>
            </div>
            <div class="list-video">
              <img v-for="img in e.imgs" :key="img.id" :src="img.url" alt="" @click="ZoomImg(img.url)">
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="zoom-img">
      <img :src="activeImg" alt="" @click="isActiveImg = false">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        time: '',
        selectValue: ''
      },
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
        ]},
        {id: 2, date: '2020-05-06', name: '飞手3', title: '拍摄图片', imgs: [
          {id: 0, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 1, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'}
        ]},
        {id: 3, date: '2020-05-06', name: '飞手2', title: '拍摄图片', imgs: [
          {id: 0, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 1, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'}
        ]},
        {id: 4, date: '2020-05-06', name: '飞手3', title: '拍摄图片', imgs: [
          {id: 0, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'},
          {id: 1, url: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2647976732,4085855147&fm=85&app=92&f=JPEG?w=121&h=75&s=309A6D7E708877594C19BDAA0300B02D'}
        ]}
      ],
      isActiveImg: false,
      activeImg: ''
    }
  },
  created () {},
  mounted () {},
  watch: {},
  computed: {},
  methods: {
    onSearch () {},
    ZoomImg (url) {
      this.isActiveImg = true
      this.activeImg = url
    }
  }
}
</script>

<style lang="scss" scoped>
.video{
  position: relative;
  .content{
    height: 750px;
    padding: 30px;
    // overflow-y: scroll;
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
          .list-video{
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
</style>
