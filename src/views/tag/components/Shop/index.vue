<template>
  <el-card>
    <div slot="header">
      <span>店铺信息</span>
    </div>
    <div style="float: left;">
      <img :src="IPFS_GATEWAY + '/' + shop.icon" height="120px" alt="">
    </div>
    <div style="margin-left: 20px; display: inline-block; vertical-align: middle;">
      <strong>{{ shop.name }}</strong>
      <p><small>{{ shop.content }}</small></p>
      <p><el-button type="primary" size="mini" icon="el-icon-s-shop"><a :href="shop.url">进入官方店铺</a></el-button></p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Shop',
  props: {
    shop: {
      type: Object,
      required: true
    }
  }
}
</script>
