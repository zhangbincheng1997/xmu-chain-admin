<template>
  <el-card>
    <el-page-header @back="$router.go(-1)" />
    <br>
    <el-descriptions title="批次信息">
      <el-descriptions-item label="批次号">{{ batchInfo.no }}</el-descriptions-item>
      <el-descriptions-item label="商品名称">{{ batchInfo.productName }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
import { getBatchById } from '@/api/service-trace/batch'

export default {
  name: 'BatchInfo',
  data() {
    return {
      batchInfo: {
        no: undefined,
        productName: undefined
      }
    }
  },
  mounted() {
    const batchId = this.$route.query.batchId
    if (!batchId) return
    getBatchById(batchId).then(res => {
      this.batchInfo = res.data
    })
  }
}
</script>
