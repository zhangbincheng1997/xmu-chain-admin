<template>
  <el-select v-model="currentId" placeholder="批次号" filterable clearable @change="handleChange">
    <el-option v-for="item in batchList" :key="item.id" :label="item.label" :value="item.id" />
  </el-select>
</template>

<script>
import { list } from '@/api/service-trace/batch'

export default {
  name: 'BatchComplete',
  props: {
    id: {
      type: String,
      default: undefined
    },
    onFinish: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      currentId: this.id,
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
      this.$emit('update:id', value)
    }
  }
}
</script>
