<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.tagId" placeholder="标签编号" style="width: 200px;" clearable />
      <el-input v-model="query.keyword" placeholder="关键词（用户/IP/地点）" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column label="#" prop="id" width="50" align="center" fixed="left" />
        <el-table-column label="标签编号" prop="tagId" width="100" align="center" fixed="left">
          <template slot-scope="scope">
            <span class="link" @click="linkTag(scope.row.tagId)">{{ scope.row.tagId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户" prop="username" align="center" />
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

    <el-dialog
      :title="DialogTitle[DialogType.DETAIL]"
      :visible.sync="visible"
      center
      @close="visible=false"
    >
      <el-descriptions :title="'# ' + form.id + ' - ' + form.createTime">
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
import tag from '@/api/service-trace/tag'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  tagId: undefined,
  keyword: undefined
}

export default {
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      query: Object.assign({}, defaultQuery),
      list: [],
      total: 0,

      selectId: undefined,
      dialogType: undefined,
      visible: false,
      form: {
        tagId: undefined,
        username: undefined,
        ip: undefined,
        location: undefined,
        longitude: undefined,
        latitude: undefined
      },

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle
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
      tag.listSearch(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleDetail(row) {
      this.visible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    linkTag: function(val) {
      this.$router.push({
        path: '/tag/index',
        query: {
          id: val
        }
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
