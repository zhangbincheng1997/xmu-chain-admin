<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-page-header :content="'当前溯源码：' + code" @back="back()" />
      <br>
      <el-tabs tab-position="left">
        <el-tab-pane label="生长信息"><grow :code="code" /></el-tab-pane>
        <el-tab-pane label="农事信息"><farm :code="code" /></el-tab-pane>
        <el-tab-pane label="加工信息"><process :code="code" /></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Grow from './components/grow'
import Farm from './components/farm'
import Process from './components/process'

export default {
  components: {
    Grow,
    Farm,
    Process
  },
  data() {
    return {
      code: ''
    }
  },
  mounted() {
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
