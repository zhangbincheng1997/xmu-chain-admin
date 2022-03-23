<template>
  <div class="app-container">
    <el-card>
      <batch-complete :no.sync="query.batchNo" />
      <el-date-picker v-model="query.start" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" />
      <el-date-picker v-model="query.end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" />
      <br>
      <el-input v-model="query.code" placeholder="溯源码" style="width: 300px;" clearable />
      <el-input v-model="query.keyword" placeholder="关键词（IP/地点/经度/纬度）" style="width: 300px;" clearable />
      <el-button icon="el-icon-search" @click="handleQuery">查询</el-button>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="批次信息" prop="batchInfo" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkBatch(scope.row.batchId)">{{ scope.row.productName + '(' + scope.row.batchNo + ')' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="溯源码" prop="code" align="center" />
        <el-table-column label="IP" prop="ip" align="center" />
        <el-table-column label="地点" prop="location" align="center" />
        <el-table-column label="经度" prop="longitude" align="center" />
        <el-table-column label="纬度" prop="latitude" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>
  </div>
</template>

<script>
import { list } from '@/api/service-trace/scan'
import BatchComplete from '@/components/BatchComplete'

export default {
  components: {
    BatchComplete
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        batchNo: undefined,
        code: undefined,
        start: undefined,
        end: undefined,
        sort: false
      }
    }
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.loading = true
      list(this.query).then(res => {
        this.loading = false
        this.list = res.data
        this.total = res.total
      })
    },
    handleSortChange({ column, prop, order }) {
      this.query.sort = order === 'descending' // default ascending
      this.handleQuery()
    }
  }
}
</script>
