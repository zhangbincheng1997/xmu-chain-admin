<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="searchKey" placeholder="请输入区块哈希或块高" style="width: 500px;float:right;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
      <el-table
        v-loading="loading"
        :data="list"
        @row-click="handleRowClick"
      >
        <el-table-column prop="blockNumber" label="块高" width="120" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link(scope.row.blockNumber)">{{ scope.row.blockNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transCount" label="交易" width="100" align="center" />
        <el-table-column prop="pkHash" label="区块哈希" align="center">
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="复制哈希" @click="copyPublicKey(scope.row.pkHash)" />
            {{ scope.row.pkHash }}
          </template>
        </el-table-column>
        <el-table-column prop="blockTimestamp" label="创建时间" width="280" align="center" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getBlockList" />
    </el-card>
  </div>
</template>

<script>
import router from '@/router'
import { getBlockList } from '@/api/chain'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  groupId: localStorage.getItem('groupId') || 1,
  transactionHash: undefined, // 交易hash
  blockNumber: undefined // 块高
}

export default {
  name: 'BlockInfo',
  components: {
    Pagination
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
    if (this.$route.query.pkHash) {
      this.query.pkHash = this.$route.query.pkHash
      this.searchKey = this.query.pkHash
    }
    if (this.$route.query.blockNumber) {
      this.query.blockNumber = this.$route.query.blockNumber
      this.searchKey = this.query.blockNumber
    }
    this.getBlockList()
  },
  methods: {
    search() {
      this.query.pkHash = undefined
      this.query.blockNumber = undefined
      if (this.searchKey) {
        if (this.searchKey.length === 66) {
          this.query.pkHash = this.searchKey
        } else {
          this.query.blockNumber = this.searchKey
        }
      }
      this.getBlockList()
    },
    getBlockList: function() {
      this.loading = true
      getBlockList(this.query).then(res => {
        this.loading = false
        this.list = res.data
        this.total = res.totalCount
      })
    },
    handleRowClick: function(row, column, $event) {
      const nodeName = $event.target.nodeName
      if (nodeName === 'I') return // copyPublicKey
      this.link(row.blockNumber)
    },
    link: function(val) {
      router.push({
        path: '/chain/transactionInfo',
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
  color: #0db1c1;
  cursor: pointer;
}
</style>
