<template>
  <div class="over-view-wrapper">
    <div style="margin: 5px;">
      <div>
        <el-row>
          <el-col v-loading="loadingNumber" :xs="24" :sm="24" :md="11" :lg="10" :xl="8">
            <div v-for="item in numberHead" :key="item.label" class="overview-item" :class="item.bg" @click="goDetailRouter(item)">
              <div class="overview-item-img">
                <img class="overview-item-svg" :src="item.icon" alt="">
              </div>
              <div class="overview-item-content">
                <div class="overview-item-number">{{ item.value }}</div>
                <div class="overview-item-title">{{ item.label }}</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="13" :lg="14" :xl="16">
            <div class="bg-fff">
              <div class="part2-title">
                <span class="part2-title-left">关键监控指标</span>
                <span class="part2-title-right">最近有交易的7天交易量（笔）</span>
              </div>
              <div ref="chart">
                <v-chart v-if="chartStatistics.show" :id="'chartId'" v-loading="loadingCharts" :data="chartStatistics.date" :transaction-data-arr="chartStatistics.dataArr" :size="chartStatistics.chartSize" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table v-loading="loadingNodes" :data="nodeList" class="search-table-content">
          <el-table-column v-for="head in nodeHead" :key="head.enName" :label="head.name" :width="head.width" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <template>
                <span v-if="head.enName ==='nodeActive'">
                  <i :style="{'color': colorMap[scope.row[head.enName]]}">{{ statusMap[scope.row[head.enName]] }}</i>
                </span>
                <span v-else-if="head.enName === 'nodeId'">
                  <i class="el-icon-copy-document" title="复制" @click="copyText(scope.row[head.enName])" />
                  {{ scope.row[head.enName] }}
                </span>
                <span v-else>{{ scope.row[head.enName] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div class="overview-wrapper">
              <p>
                <span class="overview-title">区块数量</span>
                <span class="overview-more cursor-pointer" @click="goRouter('blocks')">更多</span>
              </p>
              <div v-loading="loadingBlock" class="overview-item-base">
                <div v-for="item in blockList" :key="item.blockNumber" class="block-item font-color-2e384d">
                  <div class="block-amount">
                    <p class="trans-hash">
                      <i class="el-icon-coin" />
                      <router-link :to="{'path': '/browser/blockInfo', 'query': {blockNumber: item.blockNumber}}" class="node-ip">
                        块高 {{ item.blockNumber }}
                      </router-link>
                    </p>
                    <p class="trans-address color-8798AD">
                      <span>
                        <i class="el-icon-s-order" />
                        {{ item.transCount }} txns
                      </span>
                      <img :src="sRight" alt="">
                      <span>
                        <i class="el-icon-copy-document" title="复制" @click="copyText(item.sealer)" />
                        {{ splitAddress(item.sealer) }}
                      </span>
                    </p>
                  </div>
                  <p class="color-8798AD">{{ item.blockTimestamp }}</p>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div class="overview-wrapper">
              <p>
                <span class="overview-title">交易数量</span>
                <span class="overview-more cursor-pointer" @click="goRouter('transactions')">更多</span>
              </p>
              <div v-loading="loadingTransaction" class="overview-item-base">
                <div v-for="item in transactionList" :key="item.transHash" class="block-item font-color-2e384d">
                  <div class="block-amount">
                    <p class="trans-hash">
                      <i class="el-icon-copy-document" title="复制" @click="copyText(item.transHash)" />
                      <router-link :to="{'path': '/browser/transactionInfo', 'query': {transactionHash: item.transHash}}" class="node-ip">
                        {{ item.transHash }}
                      </router-link>
                    </p>
                    <p class="trans-address color-8798AD">
                      <span>
                        <i class="el-icon-copy-document" title="复制" @click="copyText(item.transFrom)" />
                        {{ splitAddress(item.transFrom) }}
                      </span>
                      <img :src="sRight" alt="">
                      <span>
                        <i class="el-icon-copy-document" title="复制" @click="copyText(item.transTo)" />
                        {{ splitAddress(item.transTo) }}
                      </span>
                    </p>
                  </div>
                  <p class="color-8798AD">{{ item.blockTimestamp }}</p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import charts from './components/chart'
import { getChartData, getNumberData, getNodeList, getBlockList, getTransactionList } from '@/api/service-eth/browser'

export default {
  name: 'BrowserHome',
  components: {
    'v-chart': charts
  },
  data: function() {
    return {
      groupId: localStorage.getItem('groupId') || 1,
      sRight: 'http://qiniu.littleredhat1997.com/xmu/s-right.png',
      loadingNumber: false, // getNetworkDetails
      loadingCharts: false, // getNetworkStatistics
      loadingNodes: false, // getNodeList
      loadingBlock: false, // getBlockList
      loadingTransaction: false, // getTransaction
      chartStatistics: {
        show: false,
        date: [],
        dataArr: [],
        chartSize: {
          width: 0,
          height: 0
        }
      },
      nodeList: [],
      blockList: [],
      transactionList: [],

      statusMap: {
        1: '运行',
        2: '异常',
        3: '启动中',
        4: '停止'
      },
      colorMap: {
        1: '#67C23A',
        2: '#F56C6C',
        3: '#E6A23C',
        4: '#909399'
      }
    }
  },
  computed: {
    numberHead() {
      return [
        { label: '节点个数', name: 'nodeCount', value: 0, icon: 'http://qiniu.littleredhat1997.com/xmu/nodes.png', bg: 'node-bg' },
        { label: '已部署的智能合约', name: 'contractCount', value: 0, icon: 'http://qiniu.littleredhat1997.com/xmu/contract.png', bg: 'contract-bg' },
        { label: '区块数量', name: 'latestBlock', value: 0, icon: 'http://qiniu.littleredhat1997.com/xmu/block.png', bg: 'block-bg' },
        { label: '交易数量', name: 'transactionCount', value: 0, icon: 'http://qiniu.littleredhat1997.com/xmu/transation.png', bg: 'transaction-bg' }
      ]
    },
    nodeHead() {
      return [
        { enName: 'nodeId', name: '节点ID', width: '' },
        { enName: 'blockNumber', name: '块高', width: 180 },
        { enName: 'pbftView', name: 'pbftView', width: 180 },
        { enName: 'nodeActive', name: '状态', width: 150 }
      ]
    }
  },
  mounted: function() {
    this.getNumberData()
    this.getNodeList()
    this.getBlockList()
    this.getTransactionList()
    this.getChartData()
  },
  methods: {
    getNumberData: function() {
      this.loadingNumber = true
      getNumberData(this.groupId).then(res => {
        this.loadingNumber = false
        this.numberHead.forEach(function(value) {
          for (const i in res.data) {
            if (value.name === i) {
              value.value = res.data[i]
            }
          }
        })
      })
    },
    getChartData: function() {
      this.loadingCharts = true
      this.chartStatistics.show = false
      this.chartStatistics.date = []
      this.chartStatistics.dataArr = []
      getChartData(this.groupId).then(res => {
        this.loadingCharts = false
        const resData = this.changWeek(res.data)
        for (let i = 0; i < resData.length; i++) {
          this.chartStatistics.date.push(resData[i].day)
          this.chartStatistics.dataArr.push(resData[i].transCount)
        }
        this.$set(this.chartStatistics, 'show', true)
      })
    },
    getNodeList: function() {
      this.loadingNodes = true
      const reqData = {
        groupId: this.groupId,
        pageNumber: 1,
        pageSize: 100
      }
      getNodeList(reqData).then(res => {
        this.loadingNodes = false
        this.nodeList = res.data
      })
    },
    getBlockList: function() {
      this.loadingBlock = true
      const reqData = {
        groupId: this.groupId,
        pageNumber: 1,
        pageSize: 6
      }
      getBlockList(reqData).then(res => {
        this.loadingBlock = false
        this.blockList = res.data
      })
    },
    getTransactionList: function() {
      this.loadingTransaction = true
      const reqData = {
        groupId: this.groupId,
        pageNumber: 1,
        pageSize: 6
      }
      getTransactionList(reqData).then(res => {
        this.loadingTransaction = false
        this.transactionList = res.data
      })
    },
    goDetailRouter(item) {
      const name = item.name
      console.log(name)
      // NONE
    },
    goRouter: function(val) {
      switch (val) {
        case 'blocks':
          this.$router.push('/browser/blockInfo')
          break
        case 'transactions':
          this.$router.push('/browser/transactionInfo')
          break
      }
    },
    splitAddress(val) {
      if (!val) return
      let startStr = ''
      let endStr = ''
      let str = ''
      startStr = val.substring(0, 8)
      endStr = val.substring(val.length - 4)
      str = `${startStr}...${endStr}`
      return str
    },
    changeDate(date) {
      const newData = new Date(date)
      const Y = newData.getFullYear()
      const M = newData.getMonth() + 1 > 9 ? newData.getMonth() + 1 : '0' + (newData.getMonth() + 1)
      const D = newData.getDate() > 9 ? newData.getDate() : '0' + newData.getDate()
      return Y + '-' + M + '-' + D
    },
    changWeek(data) {
      const lastDate = (new Date()).getTime()
      const firstDate = lastDate - 6 * 24 * 3600 * 1000
      const dateList = []
      dateList[0] = {}
      dateList[0].transCount = 0
      dateList[0].day = firstDate
      for (let i = 1; i < 7; i++) {
        dateList[i] = {}
        dateList[i].day = dateList[i - 1].day + 24 * 3600 * 1000
        dateList[i].transCount = 0
      }
      for (let i = 0; i < 7; i++) {
        dateList[i].day = this.changeDate(dateList[i].day)
      }
      dateList.forEach(function(value) {
        if (data && data.length) {
          for (let j = 0; j < data.length; j++) {
            if (value.day === data[j].day) {
              value.transCount = data[j].transCount
            }
          }
        }
      })
      return dateList
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/dashboard.scss';
</style>
