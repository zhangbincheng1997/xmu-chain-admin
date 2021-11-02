<template>
  <el-tabs type="border-card">
    <el-tab-pane label="交易回执">
      <el-form label-position="left" class="demo-table-expand">
        <el-form-item label="blockHash:">{{ receipt.blockHash }}</el-form-item>
        <el-form-item label="blockNumber:">{{ receipt.blockNumber }}</el-form-item>
        <el-form-item label="gasUsed:">{{ receipt.gasUsed }}</el-form-item>
        <el-form-item label="contractAddress:">{{ receipt.contractAddress }}</el-form-item>
        <el-form-item label="from:">{{ receipt.from }}</el-form-item>
        <el-form-item label="to:">{{ receipt.to }}</el-form-item>
        <el-form-item label="transactionHash:">{{ receipt.transactionHash }}</el-form-item>
        <el-form-item label="transactionIndex:">{{ receipt.transactionIndex }}</el-form-item>
        <el-form-item label="status:">{{ receipt.status }}</el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="解码">
      <el-form label-position="left" class="demo-table-expand">
        <el-form-item label="type:">{{ result.type }}</el-form-item>
        <el-form-item label="input:">
          <span v-if="!decodeInput" style="color: deeppink">{{ receipt.input }}</span>
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
        <el-form-item label="output:">
          <span v-if="!decodeOutput" style="color: deeppink">{{ receipt.output }}</span>
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
        <el-form-item label="logs:">
          <span v-if="!decodeLogs" style="color: deeppink">{{ receipt.logs }}</span>
          <div v-else>
            <div v-for="(event, i) in result.events" :key="i" class="input-data">
              <div class="input-label">
                <span class="label">methodId:</span>
                <span>{{ event.methodId }}</span>
              </div>
              <div class="input-label">
                <span class="label">function:</span>
                <span>{{ event.function }}</span>
              </div>
              <div class="input-label">
                <span class="label">address:</span>
                <span>{{ event.address }}</span>
              </div>
              <div class="input-label">
                <span class="label">topics:</span>
                <span>{{ event.topics }}</span>
              </div>
              <div class="input-label">
                <span class="label">params:</span>
                <el-table :data="event.params">
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
import { getTransactionReceipt, decode } from '@/api/chain'

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
