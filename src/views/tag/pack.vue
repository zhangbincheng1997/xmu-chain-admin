<template>
  <div class="app-container">
    <el-card>
      <el-select v-model="query.status" placeholder="标签状态" style="width: 200px;" clearable>
        <el-option v-for="item in tagStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <batch-complete :id.sync="query.batchId" />
      <el-button icon="el-icon-search" @click="handleQuery">查询</el-button>
      <el-button type="primary" icon="el-icon-plus" style="float: right;" @click="handleGenerate">生成码包</el-button>
      <br>
      <span v-if="selectIds.length > 0">
        <el-select v-model="selectStatus" clearable>
          <el-option v-for="item in tagStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button icon="el-icon-edit" @click="handleStatus">修改状态</el-button>
      </span>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="批次信息" prop="batchInfo" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkBatch(scope.row.batchId)">{{ scope.row.productName + '(' + scope.row.batchNo + ')' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="count" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-text="启用" inactive-text="禁用" @change="handleSwitchChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button :disabled="downloadTextLoading" type="text" @click="downloadText(scope.row.id)">文字码包</el-button>
            <el-button :disabled="downloadImageLoading" type="text" @click="downloadImage(scope.row.id)">图片码包</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="handleClose">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="批次" prop="batchId" required>
          <batch-complete :id.sync="form.batchId" />
        </el-form-item>
        <el-form-item label="数量" prop="count" required>
          <el-input v-model="form.count" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, status, generate, downloadText, downloadImage } from '@/api/service-trace/tag/pack'
import BatchComplete from '@/components/BatchComplete'
import fileDownload from 'js-file-download'

const tagStatusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'true' },
  { label: '禁用', value: 'false' }
]

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
        batchId: undefined,
        status: undefined,
        sort: true // 降序
      },
      dialog: {
        title: '生成码包',
        visible: false
      },
      form: {},

      selectIds: [],
      selectStatus: undefined,

      downloadTextLoading: false,
      downloadImageLoading: false,

      tagStatusOptions
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
    },
    // ----- 修改状态 -----
    handleSwitchChange(row) {
      status([row.id], row.status).then(() => {})
    },
    handleSelectionChange(val) {
      this.selectIds = val.map(item => item.id)
    },
    handleStatus() {
      this.$confirm('是否修改状态？', '提示', {
        type: 'warning'
      }).then(() => {
        status(this.selectIds, this.selectStatus).then(() => {
          this.selectIds = []
          this.selectStatus = undefined
          this.handleQuery()
        })
      })
    },
    // ----- 生成码包 -----
    handleGenerate() {
      this.dialog.visible = true
    },
    handleSubmit() {
      generate(this.form.batchId, this.form.count).then(() => {
        this.handleClose()
        this.handleQuery()
      })
    },
    handleClose() {
      this.form = {}
      this.$refs.form.resetFields()
      this.dialog.visible = false
    },
    // ----- 文字码包 -----
    downloadText(id) {
      this.downloadTextLoading = true
      downloadText(id).then(res => {
        const filename = res.headers['content-disposition'].split(';')[1].split('=')[1]
        fileDownload(res.data, unescape(decodeURI(filename)))
        this.downloadTextLoading = false
      })
    },
    // ----- 图片码包 -----
    downloadImage(id) {
      this.downloadImageLoading = true
      downloadImage(id).then(res => {
        const filename = res.headers['content-disposition'].split(';')[1].split('=')[1]
        fileDownload(res.data, unescape(decodeURI(filename)))
        this.downloadImageLoading = false
      })
    }
  }
}
</script>
