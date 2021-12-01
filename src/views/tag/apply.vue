<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-steps :active="4" align-center>
        <el-step title="步骤 1" description="填写标签申领信息" icon="el-icon-edit" />
        <el-step title="步骤 2" description="确认订单" icon="el-icon-finished" />
        <el-step title="步骤 3" description="等待物流" icon="el-icon-truck" />
        <el-step title="步骤 4" description="绑定标签" icon="el-icon-collection-tag" />
      </el-steps>
      <el-container>
        <div style="width: 500px; margin:0 auto; padding-top: 50px;">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="溯源码" prop="code" required>
              <code-complete :code.sync="form.code" />
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
        </div>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { saveOrderInfo } from '@/api/service-trace/order'

export default {
  data() {
    return {
      form: {
        code: undefined,
        count: undefined,
        name: undefined,
        phone: undefined,
        address: undefined
      },
      codeList: []
    }
  },
  methods: {
    submitForm() {
      saveOrderInfo(this.form).then((res) => {
        this.$router.push({
          path: '/order/detail',
          query: {
            id: res.data
          }
        })
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
