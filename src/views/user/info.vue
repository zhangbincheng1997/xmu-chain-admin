<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-container>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="头像" prop="avatar" required>
            <ImageUpload :image.sync="form.avatar" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname" required>
            <el-input v-model="form.nickname" />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio v-for="item in genderOptions" :key="item.label" :label="item.label">{{ item.value }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="form.birthday" type="date" />
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
import { getInfo, updateInfo } from '@/api/user'
import config from '@/config'
import ImageUpload from '@/components/Upload/Image'

export default {
  components: {
    ImageUpload
  },
  data() {
    return {
      form: {
        avatar: undefined,
        nickname: undefined,
        phone: undefined,
        email: undefined,
        gender: undefined,
        birthday: undefined
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
