<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{ items.name }}</span>
    </div>
    <el-form label-width="100px">
      <el-form-item v-for="(item, i) in items.content" :key="i" :label="item.title">
        <span v-if="item.type === 'text'">{{ item.value }}</span>
        <img v-if="item.type === 'image'" :src="IPFS_GATEWAY + '/' + item.value" :style="style" alt="">
        <video v-if="item.type === 'video'" controls><source :src="IPFS_GATEWAY + '/' + item.value"></video>
        <audio v-if="item.type === 'audio'" controls><source :src="IPFS_GATEWAY + '/' + item.value"></audio>
        <a v-if="item.type === 'file'" :href="IPFS_GATEWAY + '/' + item.value" download>{{ item.value }}</a>
      </el-form-item>
    </el-form>
    <el-tag v-if="items.txId" type="success">已上链：{{ items.txId }}</el-tag>
  </el-card>
</template>

<script>
export default {
  name: 'ItemsCard',
  props: {
    items: {
      type: Object,
      required: true
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
