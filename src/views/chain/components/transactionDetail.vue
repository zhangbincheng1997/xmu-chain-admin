<template>
  <el-tabs type="border-card">
    <el-tab-pane label="交易信息">
      <el-form label-position="left" class="demo-table-expand">
        <el-form-item label="blockHash:">{{ info.blockHash }}</el-form-item>
        <el-form-item label="blockNumber:">{{ info.blockNumber }}</el-form-item>
        <el-form-item label="gas:">{{ info.gas }}</el-form-item>
        <el-form-item label="from:">{{ info.from }}</el-form-item>
        <el-form-item label="to:">{{ info.to }}</el-form-item>
        <el-form-item label="nonce:">{{ info.nonce }}</el-form-item>
        <el-form-item label="hash:">{{ info.hash }}</el-form-item>
        <el-form-item label="input:">{{ info.input }}</el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="交易回执">
      <el-form label-position="left" class="demo-table-expand">
        <el-form-item label="output:">{{ receipt.output }}</el-form-item>
        <el-form-item label="blockHash:">{{ receipt.blockHash }}</el-form-item>
        <el-form-item label="blockNumber:">{{ receipt.blockNumber }}</el-form-item>
        <el-form-item label="gasUsed:">{{ receipt.gasUsed }}</el-form-item>
        <el-form-item label="contractAddress:">{{ receipt.contractAddress }}</el-form-item>
        <el-form-item label="from:">{{ receipt.from }}</el-form-item>
        <el-form-item label="to:">{{ receipt.to }}</el-form-item>
        <el-form-item label="transactionHash:">{{ receipt.transactionHash }}</el-form-item>
        <el-form-item label="transactionIndex:">{{ receipt.transactionIndex }}</el-form-item>
        <el-form-item label="status:">{{ receipt.status }}</el-form-item>
        <el-form-item label="logs:">{{ receipt.logs }}</el-form-item>
        <el-form-item label="logsBloom:">{{ receipt.logsBloom }}</el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 150px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
</style>

<script>
import { getTransInfo, getTransactionReceipt } from '@/api/chain'

export default {
  name: 'TransactionDetail',
  props: {
    transHash: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      info: [],
      receipt: []
    }
  },
  mounted: function() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const reqData = {
        transHash: this.transHash
      }
      getTransInfo(reqData).then(res => {
        this.info = res.data
      })
      getTransactionReceipt(reqData).then(res => {
        this.receipt = res.data
      })
    }
  }
}
</script>
