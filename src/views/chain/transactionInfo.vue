<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="searchKey" placeholder="请输入交易哈希或块高" style="width: 500px;float:right;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
      <el-table
        ref="refTable"
        v-loading="loading"
        :data="list"
        @row-click="handleRowClick"
      >
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <v-transaction-detail :trans-hash="scope.row.transHash" />
          </template>
        </el-table-column>
        <el-table-column prop="transHash" label="交易哈希" align="center">
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="复制哈希" @click="copyPublicKey(scope.row.transHash)" />
            {{ scope.row.transHash }}
          </template>
        </el-table-column>
        <el-table-column prop="blockNumber" label="块高" width="120" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link(scope.row.blockNumber)">{{ scope.row.blockNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="blockTimestamp" label="创建时间" width="280" align="center" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getTransactionList" />
    </el-card>
  </div>
</template>

<script>
import router from '@/router'
import { getTransactionList } from '@/api/chain'
import Pagination from '@/components/Pagination'
import transactionDetail from './components/transactionDetail'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  groupId: localStorage.getItem('groupId') || 1,
  transactionHash: undefined, // 区块hash
  blockNumber: undefined // 块高
}

export default {
  name: 'TransactionInfo',
  components: {
    Pagination,
    'v-transaction-detail': transactionDetail
  },
  data: function() {
    return {
      loading: false,
      query: Object.assign({}, defaultQuery),
      list: [],
      total: 0,
      searchKey: ''
    }
  },
  mounted: function() {
    if (this.$route.query.transactionHash) {
      this.query.transactionHash = this.$route.query.transactionHash
      this.searchKey = this.query.transactionHash
    }
    if (this.$route.query.blockNumber) {
      this.query.blockNumber = this.$route.query.blockNumber
      this.searchKey = this.query.blockNumber
    }
    this.getTransactionList()
  },
  methods: {
    search() {
      this.query.transactionHash = undefined
      this.query.blockNumber = undefined
      if (this.searchKey) {
        if (this.searchKey.length === 66) {
          this.query.transactionHash = this.searchKey
        } else {
          this.query.blockNumber = this.searchKey
        }
      }
      this.getTransactionList()
    },
    getTransactionList: function() {
      this.loading = true
      getTransactionList(this.query).then(res => {
        this.loading = false
        this.list = res.data
        this.total = res.totalCount
      })
    },
    handleRowClick: function(row, column, $event) {
      const nodeName = $event.target.nodeName
      if (nodeName === 'I') return // copyPublicKey
      this.$refs.refTable.toggleRowExpansion(row)
    },
    link: function(val) {
      router.push({
        path: '/chain/blockInfo',
        query: {
          blockNumber: val
        }
      })
    },
    copyPublicKey(val) {
      this.$copyText(val).then(() => {
        this.$message({
          type: 'success',
          message: '复制成功',
          duration: 2000
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.link {
  color: royalblue;
  cursor: pointer;
}
</style>
