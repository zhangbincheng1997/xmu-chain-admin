<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="#" prop="id" width="50" align="center" fixed="left" />
        <el-table-column label="溯源码" prop="code" width="100" align="center" fixed="left">
          <template slot-scope="scope">
            <span class="link" @click="linkTrace(scope.row.code)">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="image" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="温度" prop="temperature" align="center" />
        <el-table-column label="湿度" prop="humidity" align="center" />
        <el-table-column label="光照" prop="light" align="center" />
        <el-table-column label="操作用户ID" prop="userId" align="center" />
        <el-table-column label="交易Hash" prop="transHash" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="copyText" @click="copyText(scope.row.transHash)" />
            <span class="link" @click="linkTransaction(scope.row.transHash)">{{ scope.row.transHash }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <div v-if="!form.id">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="溯源码" prop="code" required>
            <el-autocomplete v-model="form.code" placeholder="请输入溯源码" :fetch-suggestions="querySearchAsync" />
          </el-form-item>
          <el-form-item label="图片" prop="image">
            <ImageUpload :image.sync="form.image" />
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="温度" prop="temperature">
                <el-input v-model="form.temperature" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="湿度" prop="humidity">
                <el-input v-model="form.humidity" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="光照" prop="light">
                <el-input v-model="form.light" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-descriptions :title="'# ' + form.id + ': ' + form.createTime">
          <el-descriptions-item label="温度">{{ form.temperature }}</el-descriptions-item>
          <el-descriptions-item label="湿度">{{ form.humidity }}</el-descriptions-item>
          <el-descriptions-item label="光照">{{ form.light }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ form.remark }}</el-descriptions-item>
          <el-descriptions-item label="操作用户ID">{{ form.userId }}</el-descriptions-item>
          <el-descriptions-item label="交易Hash">{{ form.transHash }}</el-descriptions-item>
        </el-descriptions>
        <el-image :src="form.image" :preview-src-list="[form.image]" style="width: 100px; height: 100px" fit="contain" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { allTrace } from '@/api/service-trace/trace/admin'
import { add, list } from '@/api/service-trace/trace/grow'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        code: undefined
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        id: undefined,
        code: undefined,
        image: undefined,
        temperature: undefined,
        humidity: undefined,
        light: undefined,
        remark: undefined,
        userId: undefined,
        transHash: undefined,
        createTime: undefined,
        updateTime: undefined
      },
      codeList: []
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
      list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
      allTrace().then(res => {
        res.data.forEach(item => this.codeList.push({ value: item.code }))
      })
    },
    handleAdd() {
      this.resetForm()
      this.dialog = {
        title: '新增',
        visible: true
      }
    },
    handleDetail(row) {
      this.resetForm()
      this.dialog = {
        title: '详细信息',
        visible: true
      }
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleSubmit() {
      const id = this.form.id
      if (id === undefined) {
        add(this.form).then(() => {
          this.closeDialog()
          this.getList()
        })
      }
    },
    closeDialog() {
      this.resetForm()
      this.dialog = {
        title: undefined,
        visible: false
      }
    },
    resetForm() {
      this.form = {}
      if (this.$refs.form) this.$refs.form.resetFields()
    },
    querySearchAsync(queryString, cb) {
      const results = queryString ? this.codeList.filter(this.searchFilter(queryString)) : this.codeList
      cb(results)
    },
    searchFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }
  }
}
</script>
