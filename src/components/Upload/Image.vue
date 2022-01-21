<template>
  <el-upload
    action=""
    :http-request="handleUpload"
    :show-file-list="false"
    accept=".jpg, .jpeg, .png, .gif"
  >
    <img v-if="image" :src="imageUrl" :style="style" alt="">
    <i v-else class="el-icon-plus" />
  </el-upload>
</template>

<script>
import { upload } from '@/api/ipfs'

export default {
  name: 'UploadImage',
  props: {
    image: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      required: false
    },
    height: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      style: {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  },
  computed: {
    imageUrl() {
      return this.IPFS_GATEWAY + '/' + this.image
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
        this.$emit('update:image', res.data) // 子组件向父组件传值
      })
    }
  }
}
</script>
