<template>
  <div class="app-container">
    <el-card>
      <el-input v-model="query.keyword" placeholder="请输入关键词" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float: right;" @click="handleAdd">添加</el-button>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="商品名称" prop="name" align="center" />
        <el-table-column label="商品内容" prop="content" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ JSON.stringify(scope.row.content) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="100%" @close="handleClose">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="商品名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="商品内容" prop="content">
          <Items :content.sync="form.content" />
        </el-form-item>
        <el-form-item v-if="form.id" prop="time">
          <el-tag type="success">创建时间：{{ form.createTime }}</el-tag>
          <el-tag type="warning">更新时间：{{ form.updateTime }}</el-tag>
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
import { listTemplate, addTemplate, updateTemplate, delTemplate } from '@/api/service-trace/template/product'
import Items from '@/components/Items'

export default {
  components: {
    Items
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        keyword: undefined,
        sort: true
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {}
    }
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.loading = true
      listTemplate(this.query).then(res => {
        this.loading = false
        this.list = res.data
        this.total = res.total
      })
    },
    handleSortChange({ column, prop, order }) {
      this.query.sort = order === 'descending' // default ascending
      this.handleQuery()
    },
    handleAdd() {
      this.dialog = {
        title: '添加',
        visible: true
      }
    },
    handleEdit(row) {
      this.dialog = {
        title: '修改',
        visible: true
      }
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleSubmit() {
      const id = this.form.id
      if (id === undefined) {
        addTemplate(this.form).then(() => {
          this.handleClose()
          this.handleQuery()
        })
      } else {
        updateTemplate(id, this.form).then(() => {
          this.handleClose()
          this.handleQuery()
        })
      }
    },
    handleClose() {
      this.form = {}
      this.$refs.form.resetFields()
      this.dialog = {
        title: undefined,
        visible: false
      }
    },
    handleDelete(row) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        delTemplate(row.id).then(() => {
          this.handleQuery()
        })
      })
    }
  }
}
</script>
