<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="code" placeholder="溯源码" style="margin: 0 auto; width: 100%;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="render" />
      </el-input>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      code: undefined
    }
  },
  mounted() {
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    }
    this.render()
  },
  methods: {
    render() {
    }
  }
}
</script>
