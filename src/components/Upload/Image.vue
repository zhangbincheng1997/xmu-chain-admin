<template>
  <el-upload
    action=""
    :http-request="uploadImage"
    :show-file-list="false"
    accept=".jpg, .jpeg, .png"
  >
    <img v-if="image" :src="ipfsImage" :style="style" class="image" alt="">
    <i v-else class="el-icon-plus" />
  </el-upload>
</template>

<script>
import { upload } from '@/api/base/ipfs'

export default {
  name: 'UploadImage',
  props: {
    image: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
    }
  },
  data() {
    return {
      style: {
        width: this.width,
        height: this.height
      }
    }
  },
  computed: {
    ipfsImage() {
      return this.IPFS_GATEWAY + '/' + this.image
    }
  },
  methods: {
    uploadImage(param) {
      if (param.file.size > 1024 * 1024 * 10) {
        this.$message.error('上传图片大小不能超过10MB!')
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
