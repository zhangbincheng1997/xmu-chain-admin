<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.tagId" placeholder="标签编号" style="width: 200px;" clearable />
      <el-input v-model="query.keyword" placeholder="关键词（IP/地点）" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="标签编号" prop="tagId" width="100" align="center" fixed="left">
          <template slot-scope="scope">
            <span class="link" @click="linkTag(scope.row.tagId)">{{ scope.row.tagId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP" prop="ip" align="center" />
        <el-table-column label="地点" prop="location" align="center" />
        <el-table-column label="经度" prop="longitude" align="center" />
        <el-table-column label="纬度" prop="latitude" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-descriptions :title="'# ' + form.id + ': ' + form.createTime">
        <el-descriptions-item label="标签编号">{{ form.tagId }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ form.username }}</el-descriptions-item>
        <el-descriptions-item label="IP">{{ form.ip }}</el-descriptions-item>
        <el-descriptions-item label="地点">{{ form.location }}</el-descriptions-item>
        <el-descriptions-item label="经度">{{ form.longitude }}</el-descriptions-item>
        <el-descriptions-item label="纬度">{{ form.latitude }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
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
        sort: true,
        keyword: undefined,
        tagId: undefined
      },
      dialog: {
        title: '查询记录',
        visible: false
      },
      form: {
        tagId: undefined,
        username: undefined,
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
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listSearch(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleSortChange({ column, prop, order }) {
      this.query.sort = order === 'descending' // default ascending
      this.getList()
    },
    handleDetail(row) {
      this.dialog.visible = true
      this.form = JSON.parse(JSON.stringify(row))
    }
  }
}
</script>
