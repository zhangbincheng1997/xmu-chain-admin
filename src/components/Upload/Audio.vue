<template>
  <el-upload
    action=""
    :http-request="handleUpload"
    :show-file-list="false"
    accept=".mp3, .wav, .ogg"
  >
    <audio v-if="audio" controls style="width: 200px;">
      <source :src="audioUrl">
    </audio>
    <i v-else class="el-icon-plus" />
  </el-upload>
</template>

<script>
import { upload } from '@/api/base/ipfs'

export default {
  name: 'UploadAudio',
  props: {
    audio: {
      type: String,
      default: ''
    }
  },
  computed: {
    audioUrl() {
      return this.IPFS_GATEWAY + '/' + this.audio
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
        this.$emit('update:audio', res.data) // 子组件向父组件传值
      })
    }
  }
}
</script>
