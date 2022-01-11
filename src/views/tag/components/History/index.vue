<template>
  <el-card>
    <div slot="header">
      <el-tag v-if="history.length === 0" type="success" effect="plain">
        <i class="el-icon-thumb" />首次扫码，正品认证！
      </el-tag>
      <el-tag v-else type="danger" effect="plain">
        <i class="el-icon-bell" />多次扫码，谨防假冒！
      </el-tag>
    </div>
    <el-form label-width="100px">
      <el-form-item label="首次扫码时间">{{ history.length > 0 ? history[0].createTime : '-' }}</el-form-item>
      <el-form-item label="首次扫码地点">{{ history.length > 0 ? history[0].location : '-' }}</el-form-item>
      <el-form-item label="扫码记录">{{ history.length }} 条</el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'History',
  props: {
    history: {
      type: Array,
      required: true
    }
  }
}
</script>
