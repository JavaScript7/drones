<template>
  <div>
    <el-dialog
      title="删除提示"
      :visible.sync="delDialog"
      :show-close="false"
      :close-on-click-modal="false"
      width="780px"
      center>
      <div>您确定删除<span>{{}}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      delDialog: false
    }
  },
  created () {},
  mounted () {},
  watch: {},
  computed: {},
  methods: {
    confirmAdd () {}
  }
}
</script>

<style lang="scss" scoped>

</style>
