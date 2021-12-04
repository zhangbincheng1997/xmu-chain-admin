<template>
  <span>
    <i class="el-icon-copy-document" title="copyText" @click="copyText(text)" />
    <span class="link" @click="linkFrom(text)">{{ text }}</span>
  </span>
</template>

<script>

export default {
  name: 'CopyFrom',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
