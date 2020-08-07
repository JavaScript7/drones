<template>
  <div class="container">
    <el-form :inline="true" :label-position="'right'" v-if="manager">
      <el-form-item label="选择用户" label-width="120px">
        <el-select v-model="actSelect" clearable>
          <el-option
            v-for="e in users"
            :key="e.id"
            :label="e.name"
            :value="e.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search">
      <el-form :inline="true" :model="search" :label-position="'right'">
        <el-form-item label="选择日期" label-width="120px">
          <el-date-picker
            v-model="search.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完成进度" label-width="120px">
          <el-select v-model="status">
            <el-option
              v-for="e in statuses"
              :key="e.id"
              :label="e.status"
              :value="e.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团队名称">
          <el-input v-model="search.name" placeholder="请输入团队名称" @keyup.enter="searchTasks" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="searchTasks">搜索</el-button>
      </el-form>
    </div>
    <!-- <ul class="search-status clearfix">
      <li
        v-for="e in statuses"
        :key="e.id"
        @click="searchTasks(e.status)">
        {{e.status}}
      </li>
    </ul> -->
    <el-table
      :data="taskInfo"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        label="日期"
        sortable
        width="190">
        <template slot-scope="scope">{{scope.row.start_time | timeStamp}} 至 {{scope.row.end_time | timeStamp}}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        sortable
        label="执行团队">
      </el-table-column>
      <el-table-column
        prop="position"
        align="center"
        sortable
        label="地点">
      </el-table-column>
      <el-table-column
        prop="executor"
        align="center"
        sortable
        label="执法人员">
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        label="联系电话"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="roletype"
        align="center"
        label="执法类型"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        sortable
        width="180">
        <template slot-scope="scope">{{scope.row.status | statusTxt}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="500">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="lookData(scope.row, scope.$index)">编辑</el-button>
          <!-- <el-button type="primary" size="small" icon="el-icon-edit" @click="editData(scope.row, scope.$index)">编辑</el-button> -->
          <!-- <el-button type="primary" size="small" icon="el-icon-download" v-if="scope.row.status === 2" @click="download(scope.row, scope.$index)">下载</el-button> -->
          <el-button type="primary" size="small" icon="el-icon-delete" v-if="manager" @click="delData(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginate mb40">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        layout="prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
      <div class="page-sum">共 {{Math.ceil(pagination.total/10)}} 页</div>
    </div>
    <!-- 查看 -->
    <el-dialog
      title="任务详情"
      :visible.sync="lookDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="780px"
      center>
      <el-form :inline="true" :model="task" :label-position="'right'" class="mb40">
        <el-form-item label="选择日期" label-width="120px">
          <el-date-picker
            v-model="task.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="团队名称" label-width="120px">
          <el-input placeholder="请输入" v-model="task.name" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="任务类型" label-width="120px">
          <el-input placeholder="请输入" v-model="task.type" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px">
          <el-input placeholder="请输入" maxlength="11" v-model="task.phone" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="执法人员" label-width="120px">
           <el-input placeholder="请输入" v-model="task.executor" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="地点" label-width="120px">
          <el-input placeholder="请输入" v-model="task.position" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-select v-model="task.status" placeholder="请选择" @change="statusChange">
            <el-option
              v-for="e in taskStatus"
              :key="e.id"
              :label="e.status"
              :value="e.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" label-width="120px" class="edit-textarea">
          <el-input type="textarea" placeholder="请输入" v-model="task.description" resize="none" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片与视频" label-width="120px">
          <input type="file" ref="file" @change="uploadFile($event)">
          <!-- <div class="video"></div> -->
          <!-- <el-upload
            class="upload-btn"
            action=""
            :on-preview="taskPreview"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <el-button size="small" plain>选择文件</el-button>
          </el-upload> -->
          <!-- <input type="file" multiple="multiple" @change="uploadImgVideo"> -->
          <!-- <form name=theform>
            <input type="radio" name="myradio" value="local_name" checked=true/> 上传文件名字保持本地文件名字
            <input type="radio" name="myradio" value="random_name" /> 上传文件名字是随机文件名, 后缀保留
          </form>
          <div id="contains">
            <a id="selectfiles" href="javascript:void(0);" class='btn'>选择文件</a>
            <a id="postfiles" href="javascript:void(0);" class='btn'>开始上传</a>
          </div> -->
        </el-form-item>
        <el-form-item label="下载" label-width="120px">
          <el-button type="primary" size="small" @click="downloadFile">下载</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lookDialog = false">取 消</el-button>
        <el-button type="primary" v-if="task.status === 1" @click="confirmFinish">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      title="编辑"
      :visible.sync="editDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="780px"
      center>
      <el-form :inline="true" :model="task" :label-position="'right'" class="mb40">
        <!-- <el-form-item label="日期" label-width="120px">
          <el-date-picker
            v-model="task.date"
            type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务类型" label-width="120px">
          <el-select v-model="task.type" placeholder="请选择">
            <el-option
              v-for="e in types"
              :key="e.roleid"
              :label="e.rolename"
              :value="e.rolename">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行人员" label-width="120px">
          <el-input placeholder="请输入" v-model="task.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px">
          <el-input placeholder="请输入" maxlength="11" v-model="task.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="执行单位" label-width="120px">
          <el-select v-model="task.unit" placeholder="请选择">
            <el-option
              v-for="e in types"
              :key="e.roleid"
              :label="e.rolename"
              :value="e.rolename">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地点" label-width="120px">
          <el-input placeholder="请输入" v-model="task.location" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务描述" label-width="120px" class="edit-textarea">
          <el-input type="textarea" placeholder="请输入" v-model="task.details" clearable resize="none"></el-input>
        </el-form-item> -->
        <el-form-item label="图片与视频" label-width="120px" class="upload">
          <!-- <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :show-file-list="true"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :file-list="fileList">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title="删除"
      :visible.sync="delDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="30%"
      center>
      <p class="toptip">确认删除该任务?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      value: '1000',
      actSelect: '',
      users: [],
      search: {
        name: '',
        time: []
      },
      status: 5,
      statuses: [
        {id: 5, status: '全部'},
        {id: 0, status: '待确认'},
        {id: 1, status: '进行中'},
        {id: 2, status: '已完成'}
      ],
      taskStatus: [
        {id: 0, status: '待确认', show: false},
        {id: 1, status: '进行中', show: false},
        {id: 2, status: '已完成', show: false}
      ],
      tasks: [],
      taskInfo: [],
      tableData: [{
        date: '2016-05-02',
        location: '软件园1期001号',
        unit: '思明无人机2队',
        phone: '13164904546',
        type: '抢险救灾',
        status: '确认中',
        name: '王小虎',
        details: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        location: '软件园1期001号',
        unit: '思明无人机1队',
        phone: '13164904546',
        type: '抢险救灾',
        status: '进行中',
        name: '王小虎',
        details: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        location: '软件园1期001号',
        unit: '思明无人机6队',
        phone: '13164904546',
        type: '抢险救灾',
        status: '待确认',
        name: '王小虎',
        details: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        location: '软件园1期001号',
        unit: '思明无人机3队',
        phone: '13164904546',
        type: '抢险救灾',
        status: '待确认',
        name: '王小虎',
        details: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        location: '软件园1期001号',
        unit: '思明无人机3队',
        phone: '13164904546',
        type: '抢险救灾',
        status: '进行中',
        name: '王小虎',
        details: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        location: '软件园1期001号',
        unit: '思明无人机3队',
        phone: '13164904546',
        type: '抢险救灾',
        status: '进行中',
        name: '王小虎',
        details: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        location: '软件园1期001号',
        unit: '思明无人机3队',
        phone: '13164904546',
        type: '抢险救灾',
        status: '已完成',
        name: '王小虎',
        details: '上海市普陀区金沙江路 1516 弄'
      }],
      missionLists: [],
      pagination: {
        currentPage: 0,
        total: 0
      },
      lookDialog: false,
      editDialog: false,
      task: {
        time: [],
        type: '',
        executor: '',
        name: '',
        phone: '',
        status: '',
        position: '',
        description: ''
      },
      taskId: '',
      selectVal: '',
      taskTypes: [],
      delDialog: false,
      delId: '',
      imageUrl: '',
      fileList: [
        {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
      ]
    }
  },
  mounted () {
    this.missionLists = this.tableData
    this.getTasks()
    if (this.manager) {
      this.getAllRoles()
      this.getSubaccount()
    } else {
      // this.getSubaccountTasks()
    }
  },
  watch: {},
  computed: {
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
    uploadFile (e) {
      let file = e.target.files[0]
      this.$axios.get(this.api.aliOssUrl).then(res => {
        let filename = new Date().getTime() + file.name
        let form = new FormData()
        form.append('name', file.name)
        form.append('key', filename)
        form.append('policy', res.policy)
        form.append('OSSAccessKeyId', res.accessid)
        form.append('success_action_status', 200)
        form.append('callback', res.callback)
        form.append('signature', res.signature)
        form.append('file', file)
        this.$axios.post(res.host, form).then(res => {
          let data = {
            objname: filename,
            task_id: this.taskId,
            type: 0
          }
          this.$axios.post(this.api.addTaskPic, data, {
            params: this.params
          }).then(res => {
            if (res.Status === 0) {
              this.$message.success('上传成功！')
              this.searchTasks()
            } else {
              this.$message.error(res.Msg)
            }
          })
        })
      })
    },
    getAllRoles () {
      this.$axios.get(this.api.allRoles, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          // this.users = res.Data
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    getSubaccount () {
      this.$axios.get(this.api.managerInfo, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.users = res.Data.subaccount
        }
      })
    },
    getTasks () { // 管理员或者子账号查询任务
      let url = ''
      url = this.manager ? this.api.tasks : this.api.subaccountTask
      this.$axios.get(url, {
        params: {
          id: this.$store.state.userInfo.ID,
          token: this.$store.state.userInfo.SocketToken,
          limit: 10,
          offset: this.pagination.currentPage * 1
        }
      }).then(res => {
        if (res.Status === 0) {
          this.pagination.total = res.Data.count
          this.taskInfo = res.Data.tasks
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    getSubaccountTasks () {
      this.$axios.get(this.api.subaccountTask, {
        params: {
          id: this.$store.state.userInfo.ID,
          token: this.$store.state.userInfo.SocketToken,
          limit: 10,
          offset: this.pagination.currentPage * 1
        }
      }).then(res => {
        if (res.Status === 0) {
          this.taskInfo = res.Data
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    statusSearch (type) {
      if (type !== '全部') {
        this.missionLists = this.tableData.filter(e => e.status === type)
      } else {
        this.missionLists = this.tableData
      }
    },
    searchTasks () { // 管理员或者子账号搜索任务
      let url = ''
      let data = ''
      if (this.manager) {
        url = this.api.searchTask
        data = {
          name: this.search.name,
          status: this.status,
          start_time: this.search.time[0] / 1000 || 0,
          end_time: this.search.time[1] / 1000 || 0,
          sub_count_id: this.actSelect || 0
        }
      } else {
        url = this.api.subSearchTask
        data = {
          name: this.search.name,
          status: this.status,
          start_time: this.search.time[0] / 1000 || 0,
          end_time: this.search.time[1] / 1000 || 0
        }
      }
      this.$axios.post(url, data, {
        params: {
          id: this.$store.state.userInfo.ID,
          token: this.$store.state.userInfo.SocketToken,
          limit: 10,
          offset: 0
        }
      }).then(res => {
        if (res.Status === 0) {
          this.pagination.total = res.Data.count
          this.taskInfo = res.Data.tasks
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    statusChange () { // 更新任务状态
      let data = {
        id: this.taskId,
        status: this.task.status
      }
      this.$axios.post(this.api.updateTaskStatus, data, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.getTasks()
          this.lookDialog = false
          this.$message.success('更新任务成功')
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    initUpload () {
      let accessid = ''
      let accesskey = ''
      let host = ''
      let policyBase64 = ''
      let signature = ''
      let callbackbody = ''
      let filename = ''
      let key = ''
      let expire = 0
      let g_object_name = ''
      let g_object_name_type = ''
      let timestamp = ''
      let now = timestamp = Date.parse(new Date()) / 1000;
      send_request()
      function send_request(){
          var xmlhttp = null;
          if (window.XMLHttpRequest)
          {
              xmlhttp=new XMLHttpRequest();
          }
          else if (window.ActiveXObject)
          {
              xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
          }
        
          if (xmlhttp!=null)
          {
              // serverUrl是 用户获取 '签名和Policy' 等信息的应用服务器的URL，请将下面的IP和Port配置为您自己的真实信息。
              let serverUrl = 'http://8.129.9.170:8971'
              xmlhttp.open( "GET", serverUrl, false );
              xmlhttp.send( null );
              return xmlhttp.responseText
          }
          else
          {
              alert("Your browser does not support XMLHTTP.");
          }
      };
      return false
      function check_object_radio() {
          var tt = document.getElementsByName('myradio');
          console.log(tt)
          for (var i = 0; i < tt.length ; i++ )
          {
              if(tt[i].checked)
              {
                  g_object_name_type = tt[i].value;
                  break;
              }
          }
      }

      function get_signature(){
          // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
          now = timestamp = Date.parse(new Date()) / 1000; 
          if (expire < now + 3)
          {
              body = send_request()
              var obj = eval ("(" + body + ")");
              host = obj['host']
              policyBase64 = obj['policy']
              accessid = obj['accessid']
              signature = obj['signature']
              expire = parseInt(obj['expire'])
              callbackbody = obj['callback'] 
              key = obj['dir']
              return true;
          }
          return false;
      };

      function random_string(len) {
          len = len || 32;
          var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
          var maxPos = chars.length;
          var pwd = '';
          for (i = 0; i < len; i++) {
          　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
          }
          return pwd;
      }

      function get_suffix(filename) {
          pos = filename.lastIndexOf('.')
          suffix = ''
          if (pos != -1) {
              suffix = filename.substring(pos)
          }
          return suffix;
      }

      function calculate_object_name(filename){
          if (g_object_name_type == 'local_name')
          {
              g_object_name += "${filename}"
          }
          else if (g_object_name_type == 'random_name')
          {
              suffix = get_suffix(filename)
              g_object_name = key + random_string(10) + suffix
          }
          return ''
      }

      function get_uploaded_object_name(filename){
          if (g_object_name_type == 'local_name')
          {
              tmp_name = g_object_name
              tmp_name = tmp_name.replace("${filename}", filename);
              return tmp_name
          }
          else if(g_object_name_type == 'random_name')
          {
              return g_object_name
          }
      }

      function set_upload_param(up, filename, ret){
          if (ret == false)
          {
              ret = get_signature()
          }
          g_object_name = key;
          if (filename != '') { suffix = get_suffix(filename)
              calculate_object_name(filename)
          }
          new_multipart_params = {
              'key' : g_object_name,
              'policy': policyBase64,
              'OSSAccessKeyId': accessid, 
              'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
              'callback' : callbackbody,
              'signature': signature,
          };

          up.setOption({
              'url': host,
              'multipart_params': new_multipart_params
          });

          up.start();
      }

      var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : 'selectfiles', 
          //multi_selection: false,
        container: document.getElementById('contains'),
        // flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
        // silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
          url : 'http://oss.aliyuncs.com',
          filters: {
              mime_types : [ //只允许上传图片和zip文件
              { title : "Image files", extensions : "jpg,gif,png,bmp" }, 
              { title : "Zip files", extensions : "zip,rar" }
              ],
              max_file_size : '1000mb', //最大只能上传10mb的文件
              prevent_duplicates : true //不允许选取重复文件
          },

        init: {
          PostInit: function() {
            document.getElementById('ossfile').innerHTML = '';
            document.getElementById('postfiles').onclick = function() {
                      set_upload_param(uploader, '', false);
                      return false;
            };
          },
          FilesAdded: function(up, files) {
            plupload.each(files, function(file) {
              document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
              +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
              +'</div>';
            });
          },

          BeforeUpload: function(up, file) {
                  check_object_radio();
                  set_upload_param(up, file.name, true);
              },

          UploadProgress: function(up, file) {
            var d = document.getElementById(file.id);
            d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                  var prog = d.getElementsByTagName('div')[0];
            var progBar = prog.getElementsByTagName('div')[0]
            progBar.style.width= 2*file.percent+'px';
            progBar.setAttribute('aria-valuenow', file.percent);
          },

          FileUploaded: function(up, file, info) {
                  if (info.status == 200)
                  {
                      document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name) + ' 回调服务器返回的内容是:' + info.response;
                  }
                  else if (info.status == 203)
                  {
                      document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response;
                  }
                  else
                  {
                      document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                  } 
          },

          Error: function(up, err) {
                  if (err.code == -600) {
                      document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
                  }
                  else if (err.code == -601) {
                      document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
                  }
                  else if (err.code == -602) {
                      document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
                  }
                  else
                  {
                      document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                  }
          }
        }
      });
      uploader.init()
    },
    confirmFinish () {
      return false
      this.$axios({
        headers: {
          'Content-Type': 'application/json'
        },
        transformRequest: [function(data) {
          data = JSON.stringify(data)
          return data
        }],
        url: this.api.finishTask,
        method: 'post',
        params: this.params
      }).then(res => {
        console.log(res)
      })
    },
    lookData (row, index) {
      this.taskStatus = [
        {id: 0, status: '待确认', show: false},
        {id: 1, status: '进行中', show: false},
        {id: 2, status: '已完成', show: false}
      ]
      this.taskId = row.id
      this.task.time[0] = row.start_time * 1000
      this.task.time[1] = row.end_time * 1000
      this.task.type = row.roletype
      this.task.executor = row.executor
      this.task.phone = row.phone
      this.task.position = row.position
      this.task.description = row.description
      this.task.status = row.status
      this.task.name = row.name
      this.lookDialog = true
      this.taskStatus.forEach(e => {
        if (e.id < this.task.status*1 || e.id === this.task.status*1) {
          e.show = true
        }
      })
      // this.initUpload()
    },
    taskPreview (file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      console.log(files)
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    editData (row, index) {
      this.editDialog = true
      this.task = row
    },
    confirmEdit () {},
    download (row, index) {},
    delData (row, index) {
      this.delDialog = true
      this.delId = row.id
    },
    confirmDel () {
      this.$axios.post(this.api.delTask, {
        id: this.delId
      }, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.getTasks()
          this.$message.success('删除任务成功！')
          this.delDialog = false
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.imageUrl = file.url
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    taskFileUpload (taskId, type) { // 任务文件上传
      this.$axios.post(this.api.taskFile, {
        params: {
          id: this.$store.state.userInfo.ID,
          token: this.$store.state.userInfo.SocketToken,
          taskid: taskId,
          type
        }
      }).then(res => {
        if (res.Status === 0) {
          console.log(res.Data)
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    downloadFile () { // 下载文件
      console.log()
      return false
      this.$axios.post(this.api.uploadPic, {
        params: {
          flyerid: '',
          note: '',
          type: ''
        }
      }).then(res => {
        if (res.Status === 0) {
          console.log(res.Data)
        } else {
          this.$message.error(res.Msg)
        }
      })
    }
  },
  filters: {
    statusTxt (val) {
      let txt = ''
      return val === 0 ? '待确认' : val === 1 ? '进行中' : '已完成'
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 30px 20px 0;
  border: 1px solid #797979;
  overflow: hidden;
  .search{
    margin-bottom: 40px;
    text-align: center;
    input{
      width: 260px;
      height: 32px;
      text-indent: 10px;
      vertical-align: top;
    }
    button{
      width: 60px;
      height: 38px;
      border: 1px solid #409EFF;
      background: #409EFF;
    }
  }
  .search-status{
    width: 560px;
    margin: 0 auto 40px;
    li{
      float: left;
      width: 140px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 24px;
      color: #fff;
      &:hover{
        cursor: pointer;
      }
      &:nth-child(1){
        background-color: #00F;
      }
      &:nth-child(2){
        background-color: #F59A24;
      }
      &:nth-child(3){
        background-color: #9BCC4E;
      }
      &:nth-child(4){
        background-color: #555;
      }
    }
  }
  .el-table{
    margin-bottom: 40px;
  }
  .paginate{
    position: relative;
    .el-pagination{
      text-align: center;
    }
    .page-sum{
      position: absolute;
      left: 30%;
      bottom: 0px;
      width: 120px;
      height: 32px;
      line-height: 32px;
      color: #000;
      font-size: 14px;
      text-align: center;
    }
  }
  .toptip{
    text-align: center;
    font-size: 20px;
    color: #000;
  }
}

.upload{
  width: 566px;
  height: 260px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.video{
  width: 564px;
  height: 120px;
  border: 1px solid gray;
}
</style>
