<template>
  <el-image v-if="image" :src="ipfsImage" :preview-src-list="[ipfsImage]" :style="style" fit="contain" />
</template>

<script>

export default {
  name: 'ImagePreview',
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
    ipfsImage() {
      return this.IPFS_GATEWAY + '/' + this.image
    }
  }
}
</script>
