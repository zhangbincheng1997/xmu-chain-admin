<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list.slice((query.page-1)*query.limit,query.page*query.limit)"
      >
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" />
        <el-table-column label="角色名字" prop="name" width="200" align="center" />
        <el-table-column label="角色标签" prop="value" width="200" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="设置" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleMenu(scope.row)">菜单</el-button>
            <el-button type="text" @click="handlePermission(scope.row)">权限</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" />
    </el-card>

    <el-dialog
      :title="dialogTitle[dialogType]"
      :visible.sync="visible"
      width="30%"
      center
      @close="resetForm"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="角色名字" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色标签" prop="value" required>
          <el-input v-model="form.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="roleDialogTitle[roleDialogType]"
      :visible.sync="roleVisible"
      width="30%"
      center
      @close="resetRoleDialog"
    >
      <el-tree
        ref="tree"
        :data="roleData"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="{ label: 'name' }"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleDialog">确 定</el-button>
        <el-button @click="resetRoleDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import role from '@/api/admin/role'
import menu from '@/api/admin/menu'
import permission from '@/api/admin/permission'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10
}

export default {
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      query: Object.assign({}, defaultQuery),
      list: [],
      total: 0,

      selectId: undefined,
      dialogTitle: config.dialogTitle,
      dialogType: undefined,
      visible: false,
      form: {
        name: undefined,
        value: undefined
      },

      roleDialogTitle: config.roleDialogTitle,
      roleDialogType: undefined,
      roleVisible: false,
      roleData: undefined
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      role.list().then(res => {
        this.loading = false
        this.list = res.data
        this.total = this.list.length
      })
    },
    handleAdd() {
      this.dialogType = config.ADD
      this.visible = true
    },
    handleEdit(row) {
      this.dialogType = config.EDIT
      this.visible = true
      this.selectId = row.id
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(row))
      }) // mounted
    },
    submitForm() {
      if (this.dialogType === config.ADD) {
        role.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === config.EDIT) {
        role.edit(this.selectId, this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      }
    },
    resetForm() {
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleRemove(row) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        role.remove(row.id).then(() => {
          this.getList()
        })
      })
    },
    handleMenu(row) {
      menu.tree().then(res => {
        this.roleData = res.data
        role.getMenu(row.id).then(res => {
          this.$refs.tree.setCheckedKeys(res.data)
        })
      })
      this.roleDialogType = config.MENU
      this.roleVisible = true
      this.selectId = row.id
    },
    handlePermission(row) {
      permission.tree().then(res => {
        this.roleData = res.data
        role.getPermission(row.id).then(res => {
          this.$refs.tree.setCheckedKeys(res.data)
        })
      })
      this.roleDialogType = config.PERMISSION
      this.roleVisible = true
      this.selectId = row.id
    },
    submitRoleDialog() {
      if (this.roleDialogType === config.MENU) {
        role.setMenu(this.selectId, this.$refs.tree.getCheckedKeys()).then(() => {
          this.resetRoleDialog()
        })
      } else if (this.roleDialogType === config.PERMISSION) {
        role.setPermission(this.selectId, this.$refs.tree.getCheckedKeys()).then(() => {
          this.resetRoleDialog()
        })
      }
    },
    resetRoleDialog() {
      this.roleVisible = false
      this.roleData = undefined
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
