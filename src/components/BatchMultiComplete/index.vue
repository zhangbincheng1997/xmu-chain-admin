<template>
  <el-select v-model="currentIds" placeholder="关联批次" multiple filterable clearable @change="handleChange">
    <el-option v-for="item in batchList" :key="item.id" :label="item.label" :value="item.id" />
  </el-select>
</template>

<script>
import { list } from '@/api/service-trace/batch'

export default {
  name: 'BatchComplete',
  props: {
    sources: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIds: this.sources,
      batchList: []
    }
  },
  mounted() {
    list().then(res => {
      res.data.forEach(item => this.batchList.push({ id: item.id, label: item.no + '-' + item.productName }))
    })
  },
  methods: {
    handleChange(value) {
      this.$emit('update:sources', value)
    }
  }
}
</script>
