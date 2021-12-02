<template>
  <div>
    <el-date-picker v-model="query.start" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" />
    <el-date-picker v-model="query.end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" />
    <el-button icon="el-icon-search" @click="handleQuery">查询</el-button>
    <el-button type="primary" icon="el-icon-plus" style="float: right;" @click="handleAdd">添加</el-button>
    <el-table v-loading="loading" :data="list">
      <el-table-column type="index" width="50" />
      <el-table-column label="图片" prop="image" align="center">
        <template slot-scope="scope"><image-preview :image="scope.row.image" /></template>
      </el-table-column>
      <el-table-column label="内容" prop="content" align="center" show-overflow-tooltip />
      <el-table-column label="用户地址" prop="fromAddr" align="center" show-overflow-tooltip>
        <template slot-scope="scope"><copy-user :text="scope.row.fromAddr" /></template>
      </el-table-column>
      <el-table-column label="交易哈希" prop="transHash" align="center" show-overflow-tooltip>
        <template slot-scope="scope"><copy-trans :text="scope.row.transHash" /></template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row)">详细信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <div v-if="!form.id">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="图片" prop="image">
            <ImageUpload :image.sync="form.image" />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input v-model="form.content" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-descriptions :title="form.createTime">
          <el-descriptions-item label="温度">{{ form.temperature }}</el-descriptions-item>
          <el-descriptions-item label="湿度">{{ form.humidity }}</el-descriptions-item>
          <el-descriptions-item label="光照">{{ form.light }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ form.remark }}</el-descriptions-item>
          <el-descriptions-item label="用户地址"><copy-user :text="form.fromAddr" /></el-descriptions-item>
          <el-descriptions-item label="交易哈希"><copy-trans :text="form.transHash" /></el-descriptions-item>
        </el-descriptions>
        <image-preview :image="form.image" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, list } from '@/api/service-trace/trace/op/process'

export default {
  name: 'Process',
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        code: undefined,
        start: undefined,
        end: undefined
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        id: undefined, // 主键
        code: undefined, // 溯源码
        image: undefined, // 属性
        content: undefined, // 属性
        remark: undefined, // 属性
        fromAddr: undefined,
        transHash: undefined,
        createTime: undefined,
        updateTime: undefined
      }
    }
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.loading = true
      this.query.code = this.code // 必不可少
      list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleAdd() {
      this.resetForm()
      this.dialog = {
        title: '添加',
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
        this.form.code = this.code // 必不可少
        add(this.form).then(() => {
          this.closeDialog()
          this.handleQuery()
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
    }
  }
}
</script>
