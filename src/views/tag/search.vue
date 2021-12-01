<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.code" placeholder="溯源码" style="width: 200px;" clearable />
      <el-input v-model="query.keyword" placeholder="关键词（IP/地点）" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="溯源码" prop="code" align="center" />
        <el-table-column label="防伪码" prop="securityCode" align="center" />
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
import { listSearch } from '@/api/service-trace/tag'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        sort: true, // 默认逆序
        keyword: undefined
      },
      form: {
        code: undefined,
        securityCode: undefined,
        ip: undefined,
        location: undefined,
        longitude: undefined,
        latitude: undefined
      }
    }
  },
  mounted() {
    if (this.$route.query.code) {
      this.query.code = this.$route.query.code
    }
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.loading = true
      listSearch(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleSortChange({ column, prop, order }) {
      this.query.sort = order === 'descending' // default ascending
      this.handleQuery()
    }
  }
}
</script>
