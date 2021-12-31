<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="searchKey" placeholder="请输入交易哈希/发送方/块高" style="width: 500px;float:right;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
      <el-table ref="refTable" v-loading="loading" :data="list" @row-click="handleRowClick">
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <v-transaction-detail :trans-hash="scope.row.transHash" />
          </template>
        </el-table-column>
        <el-table-column label="交易哈希" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="复制" @click="copyText(scope.row.transHash)" />
            {{ scope.row.transHash }}
          </template>
        </el-table-column>
        <el-table-column label="发送方" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="复制" @click="copyText(scope.row.transFrom)" />
            {{ scope.row.transFrom }}
          </template>
        </el-table-column>
        <el-table-column prop="blockNumber" label="块高" width="120" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link(scope.row.blockNumber)">{{ scope.row.blockNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="blockTimestamp" label="创建时间" width="280" align="center" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.pageNumber" :limit.sync="query.pageSize" @pagination="getTransactionList" />
    </el-card>
  </div>
</template>

<script>
import { getTransactionList } from '@/api/chain/browser'
import transactionDetail from './components/transactionDetail'

export default {
  name: 'TransactionInfo',
  components: {
    'v-transaction-detail': transactionDetail
  },
  data: function() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        pageNumber: 1,
        pageSize: 10,
        groupId: localStorage.getItem('groupId') || 1,
        transactionHash: undefined,
        transactionFrom: undefined,
        blockNumber: undefined
      },
      searchKey: ''
    }
  },
  mounted: function() {
    if (this.$route.query.transHash) {
      this.searchKey = this.$route.query.transHash
    }
    if (this.$route.query.transFrom) {
      this.searchKey = this.$route.query.transFrom
    }
    if (this.$route.query.blockNumber) {
      this.searchKey = this.$route.query.blockNumber
    }
    this.search()
  },
  methods: {
    search() {
      this.query.transactionHash = undefined
      this.query.transactionFrom = undefined
      this.query.blockNumber = undefined
      if (this.searchKey) {
        if (this.searchKey.length === 66) {
          this.query.transactionHash = this.searchKey
        } else if (this.searchKey.length === 42) {
          this.query.transactionFrom = this.searchKey
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
    link: function(val) {
      this.$router.push({
        path: '/browser/blockInfo',
        query: {
          blockNumber: val
        }
      })
    },
    handleRowClick: function(row, column, $event) {
      const nodeName = $event.target.nodeName
      if (nodeName === 'I') return // copyText
      this.$refs.refTable.toggleRowExpansion(row)
    }
  }
}
</script>
