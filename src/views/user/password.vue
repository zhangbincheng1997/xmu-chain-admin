<template>
  <div class="app-container">
    <el-card>
      <el-container>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="旧密码" prop="oldPwd" required>
            <el-input v-model="form.oldPwd" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd" required>
            <el-input v-model="form.newPwd" type="password" autocomplete="off" />
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
import { updatePassword } from '@/api/service-admin/me'

export default {
  data() {
    return {
      form: {
        oldPwd: undefined,
        newPwd: undefined
      }
    }
  },
  methods: {
    submitForm() {
      updatePassword(this.form).then(() => {})
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
