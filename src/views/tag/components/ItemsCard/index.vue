<template>
  <el-card>
    <div slot="header">
      <span>{{ items.name }}</span>
    </div>
    <el-form label-width="100px">
      <el-form-item v-for="(item, i) in items.content" :key="i" :label="item.title">
        <span v-if="item.type === 'text'">{{ item.value }}</span>
        <image-preview v-if="item.type === 'image'" :image="item.value" :width="200" />
        <video v-if="item.type === 'video'" controls style="width: 200px;"><source :src="IPFS_GATEWAY + '/' + item.value"></video>
        <audio v-if="item.type === 'audio'" controls style="width: 200px;"><source :src="IPFS_GATEWAY + '/' + item.value"></audio>
        <a v-if="item.type === 'file'" :href="IPFS_GATEWAY + '/' + item.value" download>{{ item.value }}</a>
      </el-form-item>
    </el-form>
    <el-tag type="success" effect="plain">
      <i class="el-icon-lock" />已上链：{{ items.txId }}
    </el-tag>
  </el-card>
</template>

<script>
export default {
  name: 'ItemsCard',
  props: {
    items: {
      type: Object,
      required: true
    }
  }
}
</script>
