<template>
  <span>
    <i class="el-icon-copy-document" title="copyText" @click="copyText(text)" />
    <span class="link" @click="linkHash(text)">{{ text }}</span>
  </span>
</template>

<script>

export default {
  name: 'CopyHash',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
