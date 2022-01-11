<template>
  <el-upload
    action=""
    :http-request="handleUpload"
    :show-file-list="false"
    accept=".mp4, .webm, .ogg"
  >
    <video v-if="video" controls style="width: 200px;">
      <source :src="videoUrl">
    </video>
    <i v-else class="el-icon-plus" />
  </el-upload>
</template>

<script>
import { upload } from '@/api/base/ipfs'

export default {
  name: 'UploadVideo',
  props: {
    video: {
      type: String,
      default: ''
    }
  },
  computed: {
    videoUrl() {
      return this.IPFS_GATEWAY + '/' + this.video
    }
  },
  methods: {
    handleUpload(param) {
      if (param.file.size > 1024 * 1024 * 10) {
        this.$message.error('上传大小不能超过10MB!')
        return
      }
      const formData = new FormData()
      formData.append('file', param.file)
      upload(formData).then(res => {
        this.$emit('update:video', res.data) // 子组件向父组件传值
      })
    }
  }
}
</script>
