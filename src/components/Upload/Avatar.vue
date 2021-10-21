<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :http-request="uploadAvatar"
    :show-file-list="false"
    accept=".jpg, .jpeg, .png"
  >
    <img v-if="avatar" :src="avatar" class="avatar" alt="">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import { upload } from '@/api/upload'

export default {
  name: 'AvatarUpload',
  props: {
    avatar: {
      type: String,
      default: ''
    }
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
        this.avatar = res.data
      })
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
