<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.batchNo" placeholder="批次号" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleGenerate">生成码包</el-button>
      <br>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="批次号" prop="batchNo" align="center">
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="复制" @click="copyText(scope.row.batchNo)" />
            <span class="link" @click="linkTagRecord(scope.row.batchNo)">{{ scope.row.batchNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="count" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="downloadText(scope.row.id)">文字码包</el-button>
            <el-button type="text" @click="downloadImage(scope.row.id)">图片码包</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="批次号" prop="batchNo" required>
          <code-complete :no.sync="form.batchNo" />
        </el-form-item>
        <el-form-item label="数量" prop="count" required>
          <el-input v-model="form.count" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, generate, getPackCode } from '@/api/service-trace/tag/pack'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        batchNo: undefined,
        sort: false
      },

      dialog: {
        title: '生成码包',
        visible: false
      },
      form: {
        batchNo: undefined,
        count: undefined
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
    },
    // ----- 生成码包 -----
    handleGenerate() {
      this.dialog.visible = true
    },
    handleSubmit() {
      generate(this.form.batchNo, this.form.count).then(() => {
        this.closeDialog()
        this.handleQuery()
      })
    },
    closeDialog() {
      this.dialog.visible = false
      this.$refs.form.resetFields()
    },
    // ----- 文字码包 -----
    downloadText(id) {
      getPackCode(id).then(res => {
        console.log(res)
      })
    },
    // ----- 图片码包 -----
    downloadImage(id) {
      getPackCode(id).then(res => {
        console.log(res)
      })
    },
    // ----- 跳转记录 -----
    linkTagRecord(val) {
      this.$router.push({
        path: '/tag/record',
        query: {
          batchNo: val
        }
      })
    }
  }
}
</script>
