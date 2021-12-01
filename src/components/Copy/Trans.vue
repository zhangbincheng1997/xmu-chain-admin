<template>
  <span>
    <i class="el-icon-copy-document" title="copyText" @click="copyText(text)" />
    <span class="link" @click="linkTransaction(text)">{{ text }}</span>
  </span>
</template>

<script>

export default {
  name: 'CopyTrans',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
