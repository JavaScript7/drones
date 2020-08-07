<template>
  <div class="auth">
    <div>
      <el-table
        :data="authLists"
        border
        class="table"
        :row-style="{height: '42px'}"
        :cell-style="{padding: '0'}"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="id"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="权限内容"
          align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
          align="center"
          sortable>
        </el-table-column>
        <el-table-column
          prop="type"
          label="操作类型"
          align="center"
          sortable>
        </el-table-column>
        <!-- <el-table-column
          label="管理员身份"
          align="center"
          sortable
          width="116">
          <template slot-scope="scope">
            {{scope.row.roles | rolesName}}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          prop="address"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button @click="look(scope.row, scope.$index)" type="text" size="small">查看</el-button>
            <el-button @click="edit(scope.row, scope.$index)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- <el-dialog
      title="编辑权限"
      :visible.sync="isEdit"
      :show-close="false"
      :close-on-click-modal="false"
      width="780px"
      center>
        <el-tree
          :data="authLists"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-expand-all="true"
          @check-change="handleCheckChange">
        </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        {id: 0, name: '张三', account: '1326465', roles: '1', detail: '基本功能和权限'},
        {id: 1, name: 'admin', account: '1326465', roles: '0', detail: '超级权限'},
        {id: 2, name: '李四', account: '1326465', roles: '1', detail: '基本功能和权限'},
        {id: 3, name: '王五', account: '1326465', roles: '2', detail: '无基本功能和权限'}
      ],
      activeIndex: 0,
      isEdit: false,
      authList: [{
        id: 0,
        label: '任务中心',
        children: [{
          id: 3,
          label: '任务审阅/任务查阅',
          children: [{id: 10, label: '编辑'}]
        }, {
          id: 4,
          label: '任务审阅/任务操作',
          children: [{id: 11, label: '上传'}, {id: 12, label: '下载'}, {id: 13, label: '删除'}]
        }, {
          id: 5,
          label: '任务派发',
          children: [{id: 14, label: '派发'}]
        }]
      }, {
        id: 1,
        label: '数据中心',
        children: [{
          id: 6,
          label: '图片管理/操作',
          children: [{id: 15, label: '上传'}, {id: 16, label: '下载'}, {id: 17, label: '删除'}]
        }, {
          id: 7,
          label: '视频管理/操作',
          children: [{id: 18, label: '上传'}, {id: 19, label: '下载'}, {id: 20, label: '删除'}]
        }, {
          id: 8,
          label: '飞行日志/日志操作',
          children: [{id: 21, label: '回放'}, {id: 22, label: '下载'}, {id: 23, label: '删除'}]
        }]
      }, {
        id: 2,
        label: '团队管理',
        children: [{
          id: 9,
          label: '成员管理/团队信息编辑',
          children: [{
            id: 24,
            label: '编辑'
          }]
        }]
      }],
      authLists: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {},
  mounted () {
    this.getPermisstion()
  },
  watch: {},
  computed: {
    params () {
      return {
        id: this.$store.state.userInfo.ID,
        token: this.$store.state.userInfo.SocketToken
      }
    }
  },
  methods: {
    getPermisstion () {
      this.$axios.get(this.api.permissions, {
        params: this.params
      }).then(res => {
        if (res.Status === 0) {
          this.authLists = res.Data
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    initAuthLists () {
      let val = this.tableData[this.activeIndex].roles
      switch (val) {
        case '0':
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys([1, 2, 3, 4, 5, 4, 8, 9])
          })
          break
        case '1':
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
          })
          break
        case '2':
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys([1])
          })
          break
      }
    },
    look (row, index) {},
    edit (row, index) {
      this.activeIndex = index
      this.isEdit = true
    },
    confirmEdit () {},
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      console.log(data)
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([12])
    },
  },
  filters: {
    rolesName (val) {
      let txt = ''
      switch (val) {
        case '0':
          return txt = '超级管理员'
          break
        case '1':
          return txt = '管理员'
        case '2':
          return txt = '游客'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auth{
  height: 800px;
  background: #fff;
}
/deep/ .el-tree-node__label{
  color: #409eff;
}
</style>
