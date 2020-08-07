<template>
  <div class="log">
    <el-table
      :data="logs"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="80"
        sortable>
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
    <!-- <div
      v-for="e in logs"
      :key="e.id">
      <h3>{{e.date}}</h3>
      <ul>
        <li>
          <span>{{e.time | hoursMin}}</span><span class="logs">{{e.op_name}}</span><span class="logs">{{e.log}}</span>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>

export default {
  data () {
    return {
      logs: []
    }
  },
  created () {},
  mounted () {
    this.getLogs()
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
    getLogs () {
      this.$axios.get(this.api.logs, {
        params: {
          id: this.$store.state.userInfo.ID,
          token: this.$store.state.userInfo.SocketToken,
          limit: 15,
          offset: 0
        }
      }).then(res => {
        if (res.Status === 0) {
          this.logs = res.Data
        } else {
          this.$message.error(res.Msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.log{
  padding: 30px;
  color: #fff;
  font-size: 18px;
  background: #5A5AA4;
}
.logs{
  color: #FFFF80;
}
</style>
