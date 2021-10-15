<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-user" @click="handleAdd">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" prop="id" width="100" fixed="left" />
      <el-table-column label="角色名字" align="center" prop="name" width="200" />
      <el-table-column label="角色描述" align="center" prop="content" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />

    <el-dialog
      :title="dialogTitle[dialogType]"
      :visible.sync="visible"
      width="30%"
      center
      @close="resetForm"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名字" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="content">
          <el-input v-model="form.content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, addRole, editRole, removeRole } from '@/api/role'
import Pagination from '@/components/Pagination'

// 查询
const defaultListQuery = {
  page: 1,
  limit: 10
}

export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,

      dialogTitle: {
        add: '添加',
        edit: '编辑'
      },
      dialogType: undefined,
      selectId: undefined,
      visible: false,
      form: {
        name: '',
        content: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名字', trigger: 'blur' }],
        content: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoleList().then(res => {
        this.list = res.data
        this.total = this.list.length
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogType = 'add'
      this.visible = true
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      this.visible = true
      this.$nextTick(() => {
        this.selectId = row.id
        this.form = JSON.parse(JSON.stringify(row))
      }) // mounted
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            addRole(this.form).then(res => {
              this.resetForm()
              this.getList()
            })
          } else if (this.dialogType === 'edit') {
            editRole(this.selectId, this.form).then(res => {
              this.resetForm()
              this.getList()
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleRemove(row) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRole(row.id).then(res => {
          this.getList()
        })
      })
    }
  }
}
</script>

<style lang="scss">
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
