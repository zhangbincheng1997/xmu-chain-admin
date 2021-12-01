<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-select v-model="query.status" placeholder="标签状态" style="width: 200px;" clearable>
        <el-option v-for="item in TagStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="query.from" placeholder="FROM" style="width: 100px;" clearable />
      <el-input v-model="query.to" placeholder="TO" style="width: 100px;" clearable />
      <el-input v-model="query.code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-button v-permission="[SUPER_ADMIN]" type="primary" icon="el-icon-plus" style="float:right;" @click="handleGenerate">生成防伪码</el-button>
      <br>
      <span v-if="selectIds.length > 0">
        <el-select v-model="selectStatus" placeholder="标签状态" clearable>
          <el-option v-for="item in TagStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button icon="el-icon-edit" @click="handleStatus">修改状态</el-button>
      </span>
      <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column label="#" prop="id" align="center" fixed="left" />
        <el-table-column label="溯源码" prop="code" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkTrace(scope.row.code)">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="防伪码" prop="securityCode" align="center" />
        <el-table-column label="序号" prop="number" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="标签状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === TagStatusType.NONE" type="info">{{ TagStatusMap[scope.row.status] }}</el-tag>
            <el-tag v-if="scope.row.status === TagStatusType.BIND" type="success">{{ TagStatusMap[scope.row.status] }}</el-tag>
            <el-tag v-if="scope.row.status === TagStatusType.DISCARD" type="warning">{{ TagStatusMap[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="溯源码" prop="code" required>
          <code-complete :code.sync="form.code" />
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
import { generate, status, list } from '@/api/service-trace/tag'
import config from '@/config'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        code: undefined,
        from: undefined,
        to: undefined,
        status: undefined
      },

      dialog: {
        title: '生成防伪码',
        visible: false
      },
      form: {
        code: undefined,
        count: undefined
      },

      selectIds: [],
      selectStatus: undefined,

      TagStatusOptions: config.tagStatusOptions,
      TagStatusMap: config.tagStatusMap,
      TagStatusType: config.tagStatusType
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.query.id = this.$route.query.id
    }
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.loading = true
      list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
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
    handleGenerate() {
      this.dialog.visible = true
    },
    handleSubmit() {
      generate(this.form.code, this.form.count).then(() => {
        this.closeDialog()
        this.handleQuery()
      })
    },
    closeDialog() {
      this.dialog.visible = false
      this.$refs.form.resetFields()
    }
  }
}
</script>
