<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-container>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="溯源码" prop="code" required>
            <el-input v-model="form.code" />
          </el-form-item>
          <el-form-item label="申请数量" prop="count" required>
            <el-input v-model="form.count" />
          </el-form-item>
          <el-form-item label="收货人姓名" prop="name" required>
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="收货人手机" prop="phone" required>
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="收货人地址" prop="address" required>
            <el-input v-model="form.address" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import order from '@/api/order'

export default {
  data() {
    return {
      form: {
        code: undefined,
        count: undefined,
        name: undefined,
        phone: undefined,
        address: undefined
      }
    }
  },
  mounted() {
  },
  methods: {
    submitForm() {
      order.saveOrder(this.form).then(() => {
        this.resetForm()
        this.getList()
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
