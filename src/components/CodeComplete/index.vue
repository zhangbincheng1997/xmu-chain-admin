<template>
  <el-autocomplete v-model="currentCode" placeholder="请输入溯源码" :fetch-suggestions="querySearchAsync" @input="handleInput" />
</template>

<script>
// import { allTrace } from '@/api/service-trace/trace/info'

export default {
  name: 'CodeComplete',
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentCode: this.code,
      codeList: []
    }
  },
  mounted() {
    // allTrace().then(res => {
    //   res.data.forEach(item => this.codeList.push({ value: item.code }))
    // })
  },
  methods: {
    querySearchAsync(queryString, cb) {
      const results = queryString ? this.codeList.filter(this.searchFilter(queryString)) : this.codeList
      cb(results)
    },
    searchFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleInput(value) {
      this.$emit('update:code', value)
    }
  }
}
</script>
