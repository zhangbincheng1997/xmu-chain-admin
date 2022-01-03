<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-descriptions title="批次信息">
        <el-descriptions-item label="批次号">{{ batchInfo.no }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ batchInfo.productName }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <br>
    <el-card class="box-card">
      <div style="width: 100%;">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="商品名称" prop="name" required>
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="商品内容" prop="content">
            <Items :content="form.content" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getBatchById } from '@/api/service-trace/batch/admin'
import { getProductByBatchId, update } from '@/api/service-trace/batch/product'
import Items from '@/components/Items'

export default {
  components: {
    Items
  },
  data() {
    return {
      batchId: undefined,
      batchInfo: {
        no: undefined,
        productName: undefined
      },
      form: {
        name: undefined,
        content: undefined
      }
    }
  },
  mounted() {
    this.batchId = this.$route.query.batchId
    getBatchById(this.batchId).then(res => {
      this.batchInfo = res.data
    })
    getProductByBatchId(this.batchId).then(res => {
      this.form = res.data
    })
  },
  methods: {
    submitForm() {
      update(this.form.id, this.form).then(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>
