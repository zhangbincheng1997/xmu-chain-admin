<template>
  <div class="app-container">
    <el-card>
      <el-button type="primary" icon="el-icon-plus" style="float: right;" @click="handleAdd">添加</el-button>
      <el-table v-loading="loading" :data="list.slice((query.page-1)*query.limit,query.page*query.limit)" row-key="id" default-expand-all>
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" />
        <el-table-column label="名字" prop="name" align="center" />
        <el-table-column label="接口路径" prop="url" align="center" />
        <el-table-column label="接口方法" prop="method" align="center" />
        <el-table-column label="按钮权限" prop="btnPerm" align="center" />
        <el-table-column label="图标" prop="icon" align="center">
          <template slot-scope="scope"><i :class="scope.row.icon" /></template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="handleClose">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="父节点" prop="pid">
          <el-cascader
            v-model="form.pid"
            placeholder="默认根节点"
            :options="list"
            :props="{ value: 'id', label: 'name', expandTrigger: 'hover', emitPath: false, checkStrictly: true }"
            :show-all-levels="false"
            clearable
          />
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="接口路径" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="接口方法" prop="method">
          <el-select v-model="form.method" clearable>
            <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="按钮权限" prop="btnPerm">
          <el-input v-model="form.btnPerm" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <e-icon-picker v-model="form.icon" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" />
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
import { treePermission, add, update, del } from '@/api/service-admin/permission'

const methodOptions = [
  { label: '*', value: '*' },
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
]

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {},

      methodOptions
    }
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.loading = true
      treePermission().then(res => {
        this.loading = false
        this.list = res.data
        this.total = this.list.length
      })
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
        add(this.form).then(() => {
          this.handleClose()
          this.handleQuery()
        })
      } else {
        update(id, this.form).then(() => {
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
        del(row.id).then(() => {
          this.handleQuery()
        })
      })
    }
  }
}
</script>
