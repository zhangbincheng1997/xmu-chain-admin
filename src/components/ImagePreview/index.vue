<template>
  <el-image v-if="image" :src="image" :preview-src-list="[image]" :style="style" fit="contain" />
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
  }
}
</script>
