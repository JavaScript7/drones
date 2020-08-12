<template>
  <div class="log">
    <el-table
      :data="logs"
      border
      class="table">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="80"
        sortable>
        <template slot-scope="scope">
          {{(pagination.curPage - 1) * pagination.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        align="center"
        label="时间"
        sortable>
      </el-table-column>
      <el-table-column
        prop="op_name"
        align="center"
        label="账号"
        sortable>
      </el-table-column>
      <el-table-column
        prop="log"
        align="center"
        label="操作"
        sortable>
      </el-table-column>
      <el-table-column
        prop="types"
        align="center"
        label="类型"
        sortable>
      </el-table-column>
    </el-table>
    <div class="paginate mb40">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.curPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      logs: [],
      pagination: {
        total: 0,
        curPage: 1,
        size: 10
      }
    }
  },
  created () {},
  mounted () {
    this.getLogs(this.pagination.curPage, this.pagination.size)
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
    getLogs (val, size) {
      this.$axios.get(this.api.logs, {
        params: {
          id: this.$store.state.userInfo.ID,
          token: this.$store.state.userInfo.SocketToken,
          limit: size,
          offset: val - 1 // 后端分页默认从0开始而element分页从1开始
        }
      }).then(res => {
        if (res.Status === 0) {
          this.logs = res.Data.logs
          this.pagination.total = res.Data.count
        } else {
          this.$message.error(res.Msg)
        }
      })
    },
    handleSizeChange (size) {
      this.pagination.size = size
      this.getLogs(this.pagination.curPage, size)
    },
    handleCurrentChange (val) {
      this.pagination.curPage = val
      this.getLogs(this.pagination.curPage, this.pagination.size)
    }
  }
}
</script>

<style lang="scss" scoped>
.log{
  padding: 30px;
  color: #fff;
  font-size: 18px;
  // background: #5A5AA4;
  .table{
    width: 100%;
    margin-bottom: 30px;
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
}
</style>
