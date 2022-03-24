<template>
  <div class="app-container">
    <el-card>
      <el-select v-model="query.status" placeholder="标签状态" style="width: 200px;" clearable>
        <el-option v-for="item in tagStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <batch-complete :id.sync="query.batchId" />
      <el-input v-model="query.code" placeholder="溯源码" style="width: 400px;" clearable />
      <el-button icon="el-icon-search" @click="handleQuery">查询</el-button>
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
        <el-table-column label="溯源码" prop="code" align="center" />
        <el-table-column label="二维码" prop="qrcode" align="center">
          <template slot-scope="scope">
            <el-popover placement="top" title="扫一扫（记录次数）" trigger="hover">
              <vue-qr :text="scope.row.qrcode" :size="200" />
              <vue-qr slot="reference" :text="scope.row.qrcode" :size="50" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-text="启用" inactive-text="禁用" @change="handleSwitchChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handlePreview(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-drawer :visible.sync="previewVisible" title="预览" size="50%">
      <el-card>
        <el-tabs v-model="previewIndex">
          <el-tab-pane v-for="(preview, i) in previewData" :key="i" :label="preview.productName">
            <el-divider />
            <Shop v-if="preview.shop" :shop="preview.shop" />
            <el-divider />
            <div v-for="(item, ii) in preview.items" :key="ii">
              <ItemsCard :items="item" />
              <el-divider />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { trace } from '@/api/service-trace/trace'
import { list, status } from '@/api/service-trace/tag/record'
import BatchComplete from '@/components/BatchComplete'
import Shop from '@/views/tag/components/Shop'
import ItemsCard from '@/views/tag/components/ItemsCard'
import VueQr from 'vue-qr' // https://github.com/Binaryify/vue-qr

const tagStatusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'true' },
  { label: '禁用', value: 'false' }
]

export default {
  components: {
    VueQr,
    BatchComplete,
    Shop,
    ItemsCard
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
        code: undefined,
        status: undefined,
        sort: undefined // 降序
      },

      selectIds: [],
      selectStatus: undefined,

      previewVisible: false,
      previewIndex: undefined,
      previewData: {},

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
    // ----- 预览 -----
    handlePreview(row) {
      trace(row.batchId).then(res => {
        this.previewVisible = true
        this.previewIndex = '0'
        this.previewData = res.data
      })
    }
  }
}
</script>
