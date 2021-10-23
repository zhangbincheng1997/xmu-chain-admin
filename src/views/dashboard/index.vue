<template>
  <div class="over-view-wrapper">
    <div style="margin: 5px;">
      <div style="margin:10px 10px 6px 10px;">
        <el-row>
          <el-col v-loading="loadingNumber" :xs="24" :sm="24" :md="11" :lg="10" :xl="8">
            <div v-for="item in numberHead" :key="item.label" class="overview-item" style="font-size:0" :class="item.bg" @click="goDetailRouter(item)">
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
            <div style="margin: 8px 0 0 0;" class="module-box-shadow bg-fff">
              <div class="part2-title">
                <span class="part2-title-left">关键监控指标</span>
                <span class="part2-title-right">最近有交易的7天交易量（笔）</span>
              </div>
              <div ref="chart" class="chart">
                <v-chart v-if="chartStatistics.show" :id="'chartId'" v-loading="loadingCharts" :data="chartStatistics.date" :transaction-data-arr="chartStatistics.dataArr" :size="chartStatistics.chartSize" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="module-wrapper-small" style="padding: 30px 31px 26px 32px;">
        <el-table v-loading="loadingNodes" :data="nodeList" class="search-table-content">
          <el-table-column v-for="head in nodeHead" :key="head.enName" :label="head.name" show-overflow-tooltip align="" :width="head.width">
            <template slot-scope="scope">
              <template>
                <span v-if="head.enName ==='nodeActive'">
                  <i :style="{'color': colorMap[scope.row[head.enName]]}">{{ statusMap[scope.row[head.enName]] }}</i>
                </span>
                <span v-else-if="head.enName === 'nodeId'">
                  <i class="el-icon-copy-document" title="复制" @click="copyNodeIdKey(scope.row[head.enName])" />
                  {{ scope.row[head.enName] }}
                </span>
                <span v-else>{{ scope.row[head.enName] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="min-width: 540px;margin: 8px 8px 0 9px;">
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
                      <router-link :to="{'path': 'blockInfo', 'query': {blockNumber: item.blockNumber}}" class="node-ip">
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
                        <i class="el-icon-copy-document" title="复制" @click="copyNodeIdKey(item.sealer)" />
                        {{ splitAddress(item.sealer) }}
                      </span>
                    </p>
                  </div>
                  <p class="color-8798AD text-right">{{ item.blockTimestamp }}</p>
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
                      <i class="el-icon-copy-document" title="复制" @click="copyNodeIdKey(item.transHash)" />
                      <router-link :to="{'path': 'transactionInfo', 'query': {blockNumber: item.transHash}}" class="node-ip">
                        {{ item.transHash }}
                      </router-link>
                    </p>
                    <p class="trans-address color-8798AD">
                      <span>
                        <i class="el-icon-copy-document" title="复制" @click="copyNodeIdKey(item.transFrom)" />
                        {{ splitAddress(item.transFrom) }}
                      </span>
                      <img :src="sRight" alt="">
                      <span>
                        <i class="el-icon-copy-document" title="复制" @click="copyNodeIdKey(item.transTo)" />
                        {{ splitAddress(item.transTo) }}
                      </span>
                    </p>
                  </div>
                  <p class="color-8798AD text-right">{{ item.blockTimestamp }}</p>
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
import sRight from '@/assets/images/s-right.png'
import block_img from '@/assets/images/block.png'
import nodes_img from '@/assets/images/nodes.png'
import transaction_img from '@/assets/images/transation.png'
import contract_img from '@/assets/images/contract_img.png'
import router from '@/router'

import { changWeek } from '@/utils/util'
import { getChartData, getNumberData, getNodeList, getBlockList, getTransactionList } from '@/api/eth'

export default {
  name: 'Dashboard',
  components: {
    'v-chart': charts
  },
  data: function() {
    return {
      groupId: localStorage.getItem('groupId') || 1,
      sRight: sRight,
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
        { label: '节点个数', name: 'nodeCount', value: 0, icon: nodes_img, bg: 'node-bg' },
        { label: '已部署的智能合约', name: 'contractCount', value: 0, icon: contract_img, bg: 'contract-bg' },
        { label: '区块数量', name: 'latestBlock', value: 0, icon: block_img, bg: 'block-bg' },
        { label: '交易数量', name: 'transactionCount', value: 0, icon: transaction_img, bg: 'transaction-bg' }
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
    // this.$nextTick(function() {
    //   this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth
    //   this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight
    // })
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
        const resData = changWeek(res.data)
        console.log(resData)
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
      switch (name) {
        case 'latestBlock':
          router.push('blockInfo')
          break
        case 'transactionCount':
          router.push('transactionInfo')
          break
        case 'nodeCount':
          router.push({ path: 'front', query: { from: 'home' }})
          break
        case 'contractCount':
          router.push({ path: 'contractList', query: { from: 'home', tab: 'total' }})
          break
      }
    },
    goRouter: function(val) {
      switch (val) {
        case 'blocks':
          router.push('blockInfo')
          break
        case 'transactions':
          router.push('transactionInfo')
          break
      }
    },
    copyNodeIdKey: function(val) {
      this.$copyText(val).then(() => {
        this.$message({
          type: 'success',
          message: '复制成功',
          duration: 2000
        })
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/dashboard.scss";
</style>
