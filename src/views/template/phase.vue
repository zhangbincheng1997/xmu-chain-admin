<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="请输入关键词" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="#" prop="id" width="50" align="center" fixed="left" />
        <el-table-column label="模板名称" prop="name" align="center" />
        <el-table-column label="模板标题" prop="title" align="center" />
        <el-table-column label="模板内容" prop="content" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ JSON.stringify(scope.row.content) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="100%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="模板名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="模板标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="模板内容" prop="content">
          <el-table :data="form.content">
            <el-table-column prop="title" width="200px" label="标题">
              <template slot-scope="scope">
                <el-input v-model="scope.row.title" />
              </template>
            </el-table-column>
            <el-table-column prop="type" width="200px" label="类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" clearable>
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="内容">
              <template slot-scope="scope">
                <el-input v-if="scope.row.type==='text'" v-model="scope.row.value" />
                <UploadImage v-if="scope.row.type==='image'" :image.sync="scope.row.value" />
                <UploadVideo v-if="scope.row.type==='video'" :video.sync="scope.row.value" />
                <UploadAudio v-if="scope.row.type==='audio'" :audio.sync="scope.row.value" />
                <UploadFile v-if="scope.row.type==='file'" :file.sync="scope.row.value" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="delContent(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: center">
            <el-button type="text" @click="addContent">添加一行</el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="form.id" prop="time">
          <el-tag type="success">创建时间：{{ form.createTime }}</el-tag>
          <el-tag type="warning">更新时间：{{ form.updateTime }}</el-tag>
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
import { list, add, update, del } from '@/api/service-trace/template/phase'
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
        keyword: undefined
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        id: undefined,
        name: undefined,
        title: undefined,
        content: undefined,
        createTime: undefined,
        updateTime: undefined
      },

      typeOptions: config.typeOptions
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.query.keyword = this.$route.query.id
    }
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
    handleAdd() {
      this.resetForm()
      this.dialog = {
        title: '添加',
        visible: true
      }
    },
    handleEdit(row) {
      this.resetForm()
      this.dialog = {
        title: '修改',
        visible: true
      }
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleSubmit() {
      const id = this.form.id
      if (id === undefined) {
        add(this.form).then(() => {
          this.closeDialog()
          this.handleQuery()
        })
      } else {
        update(id, this.form).then(() => {
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
    },
    handleDelete(row) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        del(row.id).then(() => {
          this.handleQuery()
        })
      })
    },
    // ----- 添加一行 -----
    addContent() {
      if (!this.form) this.form = {}
      if (!this.form.content) this.form.content = []
      this.form.content.push({})
      this.$forceUpdate()
      console.log('add: ' + JSON.stringify(this.form))
    },
    // ----- 删除一行 -----
    delContent(index) {
      this.form.content.splice(index, 1)
      console.log('del: ' + JSON.stringify(this.form))
    }
  }
}
</script>
