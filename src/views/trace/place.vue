<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="ID/NAME" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="#" prop="id" width="50" align="center" fixed="left" />
        <el-table-column label="名称" prop="name" align="center" />
        <el-table-column label="图片" prop="image" align="center">
          <template slot-scope="scope"><image-preview :image="scope.row.image" /></template>
        </el-table-column>
        <el-table-column label="交易哈希" prop="transHash" align="center" show-overflow-tooltip>
          <template slot-scope="scope"><copy-hash :text="scope.row.transHash" /></template>
        </el-table-column>
        <el-table-column label="发送方" prop="transFrom" align="center" show-overflow-tooltip>
          <template slot-scope="scope"><copy-from :text="scope.row.transFrom" /></template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="图片" prop="image" required>
          <ImageUpload :image.sync="form.image" />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址" prop="name">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="介绍" prop="content">
          <el-input v-model="form.content" type="textarea" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="面积" prop="area">
              <el-input v-model="form.area" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="海拔" prop="altitude">
              <el-input v-model="form.altitude" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { list, add, update, del } from '@/api/service-trace/trace/place'

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
        image: undefined,
        address: undefined,
        content: undefined,
        area: undefined,
        altitude: undefined,
        transHash: undefined,
        transFrom: undefined,
        createTime: undefined,
        updateTime: undefined
      }
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
    }
  }
}
</script>
