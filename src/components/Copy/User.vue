<template>
  <span>
    <i class="el-icon-copy-document" title="copyText" @click="copyText(text)" />
    <span class="link" @click="linkUser(text)">{{ text }}</span>
  </span>
</template>

<script>

export default {
  name: 'CopyUser',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
