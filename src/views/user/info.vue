<template>
  <el-container>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action=""
          :http-request="uploadAvatar"
          :show-file-list="false"
          accept=".jpg, .jpeg, .png"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
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
</template>

<script>
import { getInfo, updateInfo } from '@/api/user'
import { upload } from '@/api/upload'
import config from '@/config'

export default {
  data() {
    return {
      form: {
        avatar: '',
        nickname: ''
      },
      rules: {
        avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
      },
      genderOptions: config.genderOptions
    }
  },
  created() {
    getInfo().then(res => {
      this.form = res.data
    })
  },
  methods: {
    uploadAvatar(param) {
      if (param.file.size > 1024 * 1024 * 10) {
        this.$message.error('上传图片大小不能超过10MB!')
        return
      }
      const formData = new FormData()
      formData.append('file', param.file)
      upload(formData).then(res => {
        this.form.avatar = res.data
      })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateInfo(this.form).then(res => {})
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
