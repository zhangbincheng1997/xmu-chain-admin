<template>
  <div class="app-container">
    <el-card>
      <el-container>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="姓名" prop="name" required>
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="手机" prop="phone" required>
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email" required>
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <UploadImage :image.sync="form.avatar" />
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="form.birthday" type="date" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio v-for="item in genderOptions" :key="item.value" :label="item.label">{{ item.value }}</el-radio>
            </el-radio-group>
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
import { getInfo, updateInfo } from '@/api/service-admin/me'
import config from '@/config'

export default {
  data() {
    return {
      form: {
        name: undefined,
        phone: undefined,
        email: undefined,
        avatar: undefined,
        birthday: undefined,
        gender: undefined
      },
      genderOptions: config.genderOptions
    }
  },
  mounted() {
    getInfo().then(res => {
      this.form = res.data
    })
  },
  methods: {
    submitForm() {
      updateInfo(this.form).then(() => {})
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
