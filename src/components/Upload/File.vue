<template>
  <div>
    <el-upload
      action=""
      :http-request="handleUpload"
      :show-file-list="true"
      accept=".pdf, .txt, .doc, .docx, xls, xlsx"
    >
      <a v-if="file" :download="fileUrl">{{ file }}</a>
      <i v-else class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
import { upload } from '@/api/base/ipfs'

export default {
  name: 'UploadFile',
  props: {
    file: {
      type: String,
      default: ''
    }
  },
  computed: {
    fileUrl() {
      return this.IPFS_GATEWAY + '/' + this.file
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
        this.$emit('update:file', res.data) // 子组件向父组件传值
      })
    }
  }
}
</script>
