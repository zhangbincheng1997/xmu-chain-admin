<template>
  <el-select v-model="currentNo" placeholder="批次号" filterable clearable @change="handleChange">
    <el-option v-for="item in batchList" :key="item.no" :label="item.label" :value="item.no" />
  </el-select>
</template>

<script>
import { list } from '@/api/service-trace/batch'

export default {
  name: 'BatchComplete',
  props: {
    no: {
      type: String,
      default: ''
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    onFinish: {
      type: Function,
      default: null
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
      // 设置默认值
      if (this.isDefault && this.batchList.length > 0) {
        this.currentNo = this.batchList[0].no
        this.handleChange(this.currentNo)
      }
      // 加载完成回调
      if (this.onFinish) {
        this.onFinish()
      }
    })
  },
  methods: {
    handleChange(value) {
      this.$emit('update:no', value)
    }
  }
}
</script>
