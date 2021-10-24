<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="请输入区块哈希或块高" style="width: 500px;float:right;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getTransactionList" />
      </el-input>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form>
              <el-form-item label="From">
                <span>{{ props.row.transFrom }}</span>
              </el-form-item>
              <el-form-item label="To">
                <span>{{ props.row.transTo }}</span>
              </el-form-item>
            </el-form>
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

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  groupId: localStorage.getItem('groupId') || 1,
  keyword: undefined // 关键词
}

export default {
  name: 'ChainTransactionInfo',
  components: { Pagination },
  data: function() {
    return {
      loading: false,
      query: Object.assign({}, defaultQuery),
      list: [],
      total: 0
    }
  },
  mounted: function() {
    this.getTransactionList()
  },
  methods: {
    getTransactionList: function() {
      this.loading = true
      getTransactionList(this.query).then(res => {
        this.loading = false
        this.list = res.data
        this.total = res.totalCount
      })
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
