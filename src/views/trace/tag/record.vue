<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-select v-model="query.status" placeholder="标签状态" style="width: 200px;" clearable>
        <el-option v-for="item in tagStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="query.batchNo" placeholder="批次号" style="width: 200px;" clearable />
      <el-input v-model="query.code" placeholder="溯源码" style="width: 400px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
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
        <el-table-column label="批次号" prop="batchNo" align="center">
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="复制" @click="copyText(scope.row.batchNo)" />
            <span class="link" @click="linkTagPack(scope.row.batchNo)">{{ scope.row.batchNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="溯源码" prop="code" align="center" />
        <el-table-column label="二维码" prop="qrcode" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              title="扫一扫（记录次数）"
              trigger="hover"
            >
              <vue-qr :text="companyId + '/' + scope.row.batchNo + '/' + scope.row.code" :size="200" />
              <vue-qr slot="reference" :text="companyId + '/' + scope.row.batchNo + '/' + scope.row.code" :size="50" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="标签状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-text="启用" inactive-text="禁用" @change="handleSwitchChange(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { list, status } from '@/api/service-trace/tag/record'
import VueQr from 'vue-qr' // https://github.com/Binaryify/vue-qr

export default {
  components: {
    VueQr
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
        status: undefined,
        sort: undefined
      },

      selectIds: [],
      selectStatus: undefined,

      tagStatusOptions: [
        { label: '全部', value: '' },
        { label: '启用', value: 'true' },
        { label: '禁用', value: 'false' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'companyId'
    ])
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
    // ----- 跳转码包 -----
    linkTagPack(val) {
      this.$router.push({
        path: '/tag/pack',
        query: {
          batchNo: val
        }
      })
    }
  }
}
</script>
