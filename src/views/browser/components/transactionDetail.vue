<template>
  <el-tabs type="border-card">
    <el-tab-pane label="交易回执">
      <el-form label-position="left" class="demo-table-expand">
        <el-form-item label="交易哈希">{{ receipt.transactionHash }}</el-form-item>
        <el-form-item label="交易序号">{{ receipt.transactionIndex | parseInt }}</el-form-item>
        <el-form-item label="交易状态">{{ receipt.status | parseStatus }}</el-form-item>
        <el-form-item label="区块哈希">{{ receipt.blockHash }}</el-form-item>
        <el-form-item label="区块高度">{{ receipt.blockNumber | parseInt }}</el-form-item>
        <el-form-item label="燃料消耗">{{ receipt.gasUsed | parseInt }}</el-form-item>
        <el-form-item label="合约地址">{{ receipt.contractAddress }}</el-form-item>
        <el-form-item label="状态根">{{ receipt.root }}</el-form-item>
        <el-form-item label="发送方">{{ receipt.from }}</el-form-item>
        <el-form-item label="接收方">{{ receipt.to }}</el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="解码">
      <el-form label-position="left" class="demo-table-expand">
        <el-form-item label="类型">{{ result.type }}</el-form-item>
        <el-form-item label="输入">
          <span v-if="!decodeInput" style="color: #727476">{{ receipt.input }}</span>
          <div v-else-if="result.input">
            <div class="input-data">
              <div class="input-label">
                <span class="label">methodId:</span>
                <span>{{ result.input.methodId }}</span>
              </div>
              <div class="input-label">
                <span class="label">function:</span>
                <span>{{ result.input.function }}</span>
              </div>
              <div class="input-label">
                <span class="label">params:</span>
                <el-table :data="result.input.params">
                  <el-table-column label="name" prop="name" width="200" align="center" />
                  <el-table-column label="type" prop="type" width="200" align="center" />
                  <el-table-column label="data" prop="data" width="200" align="center" />
                </el-table>
              </div>
            </div>
          </div>
          <br>
          <el-button type="primary" @click="decodeInputClick">{{ decodeInput ? "还原" : "解码" }}</el-button>
        </el-form-item>
        <el-form-item label="输出">
          <span v-if="!decodeOutput" style="color: #727476">{{ receipt.output }}</span>
          <div v-else-if="result.output">
            <div class="input-data">
              <div class="input-label">
                <span class="label">methodId:</span>
                <span>{{ result.output.methodId }}</span>
              </div>
              <div class="input-label">
                <span class="label">function:</span>
                <span>{{ result.output.function }}</span>
              </div>
              <div class="input-label">
                <span class="label">params:</span>
                <el-table :data="result.output.params">
                  <el-table-column label="name" prop="name" width="200" align="center" />
                  <el-table-column label="type" prop="type" width="200" align="center" />
                  <el-table-column label="data" prop="data" width="200" align="center" />
                </el-table>
              </div>
            </div>
          </div>
          <br>
          <el-button type="primary" @click="decodeOutputClick">{{ decodeOutput ? "还原" : "解码" }}</el-button>
        </el-form-item>
        <el-form-item label="事件">
          <div v-for="(log, i) in result.logs" :key="i" class="input-data">
            <span v-if="!decodeLogs" style="color: #727476">{{ receipt.logs[i] }}</span>
            <div v-else>
              <div class="input-label">
                <span class="label">methodId:</span>
                <span>{{ log.methodId }}</span>
              </div>
              <div class="input-label">
                <span class="label">function:</span>
                <span>{{ log.function }}</span>
              </div>
              <div class="input-label">
                <span class="label">address:</span>
                <span>{{ log.address }}</span>
              </div>
              <div class="input-label">
                <span class="label">topics:</span>
                <span>{{ log.topics }}</span>
              </div>
              <div class="input-label">
                <span class="label">params:</span>
                <el-table :data="log.params">
                  <el-table-column label="name" prop="name" width="200" align="center" />
                  <el-table-column label="type" prop="type" width="200" align="center" />
                  <el-table-column label="data" prop="data" width="200" align="center" />
                </el-table>
              </div>
            </div>
          </div>
          <br>
          <el-button type="primary" @click="decodeLogsClick">{{ decodeLogs ? "还原" : "解码" }}</el-button>
        </el-form-item>
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

.input-data {
  display: inline-block;
  width: 100%;
  padding: 10px;
  overflow: auto;
  word-break: break-all;
  word-wrap: break-word;
  box-sizing: border-box;
}
.input-label .label {
  display: inline-block;
  font-weight: bold;
  width: 120px;
  color: #99a9bf;
}
</style>

<script>
import { getTransactionReceipt, decode } from '@/api/service-eth/browser'

export default {
  name: 'TransactionDetail',
  filters: {
    parseInt: function(value) {
      if (!value) return ''
      return parseInt(value)
    },
    parseStatus: function(value) {
      if (!value) return ''
      const status = parseInt(value)
      return status === 0 ? '正常' : status
    }
  },
  props: {
    transHash: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      receipt: [],
      result: [],
      decodeInput: false,
      decodeOutput: false,
      decodeLogs: false
    }
  },
  mounted: function() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getTransactionReceipt(this.transHash).then(res => {
        this.receipt = res.data
      })
      decode(this.transHash).then(res => {
        this.result = res.data
      })
    },
    decodeInputClick() {
      this.decodeInput = !this.decodeInput
    },
    decodeOutputClick() {
      this.decodeOutput = !this.decodeOutput
    },
    decodeLogsClick() {
      this.decodeLogs = !this.decodeLogs
    }
  }
}
</script>
