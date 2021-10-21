<template>
  <el-container>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="头像" prop="avatar">
        <AvatarUpload :avatar="form.avatar" />
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
import config from '@/config'
import AvatarUpload from '@/components/Upload/Avatar'

export default {
  components: { AvatarUpload },
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
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateInfo(this.form).then(() => {})
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
