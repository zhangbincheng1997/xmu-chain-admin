<template>
  <div class="app-container">
    <BatchInfo />
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
import { getProductByBatchId, update } from '@/api/service-trace/batch/product'
import BatchInfo from '@/components/BatchInfo'
import Items from '@/components/Items'

export default {
  components: {
    BatchInfo,
    Items
  },
  data() {
    return {
      batchId: undefined,
      form: {
        name: undefined,
        content: undefined
      }
    }
  },
  mounted() {
    this.batchId = this.$route.query.batchId
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
