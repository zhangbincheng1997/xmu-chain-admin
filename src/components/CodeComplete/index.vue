<template>
  <el-select v-model="currentNo" placeholder="请输入批次号" filterable clearable @change="handleChange">
    <el-option v-for="item in batchList" :key="item.no" :label="item.label" :value="item.no" />
  </el-select>
</template>

<script>
import { list } from '@/api/service-trace/batch/admin'

export default {
  name: 'CodeComplete',
  props: {
    no: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentNo: this.no,
      batchList: []
    }
  },
  mounted() {
    list().then(res => {
      res.data.forEach(item => this.batchList.push({ no: item.no, label: item.no + '-' + item.productName }))
    })
  },
  methods: {
    handleChange(value) {
      console.log(value)
      this.$emit('update:no', value)
    }
  }
}
</script>
