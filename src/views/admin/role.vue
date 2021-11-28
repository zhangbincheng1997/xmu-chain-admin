<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table v-loading="loading" :data="list.slice((query.page-1)*query.limit,query.page*query.limit)">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" />
        <el-table-column label="角色名字" prop="name" align="center" />
        <el-table-column label="角色标签" prop="value" align="center" />
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
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="角色名字" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色标签" prop="value" required>
          <el-input v-model="form.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="menuDialog.title" :visible.sync="menuDialog.visible">
      <el-tree
        ref="menuTree"
        :data="menuData"
        show-checkbox
        check-strictly
        default-expand-all
        node-key="id"
        :props="{ label: 'name' }"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleMenuSubmit">确 定</el-button>
        <el-button @click="closeMenuDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="permissionDialog.title" :visible.sync="permissionDialog.visible">
      <el-tree
        ref="permissionTree"
        :data="permissionData"
        show-checkbox
        check-strictly
        default-expand-all
        node-key="id"
        :props="{ label: 'name' }"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
        <el-button @click="closePermissionDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, add, update, del, getMenu, getPermission, setMenu, setPermission } from '@/api/service-admin/role'
import { treeMenu } from '@/api/service-admin/menu'
import { treePermission } from '@/api/service-admin/permission'

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
      form: {
        id: undefined,
        name: undefined,
        value: undefined
      },

      menuDialog: {
        title: '设置角色',
        visible: false
      },
      menuData: undefined,

      permissionDialog: {
        title: '设置权限',
        visible: false
      },
      permissionData: undefined
    }
  },
  mounted() {
    this.init()
    this.getList()
  },
  methods: {
    init() {
      treeMenu().then(res => {
        this.menuData = res.data
      })
      treePermission().then(res => {
        this.permissionData = res.data
      })
    },
    getList() {
      this.loading = true
      listRole().then(res => {
        this.loading = false
        this.list = res.data
        this.total = this.list.length
      })
    },
    handleAdd() {
      this.resetForm()
      this.dialog = {
        title: '新增',
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
          this.getList()
        })
      } else {
        update(id, this.form).then(() => {
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
    handleDelete(row) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        del(row.id).then(() => {
          this.getList()
        })
      })
    },
    // ----- 设置菜单 -----
    handleMenu(row) {
      this.selectId = row.id
      this.menuDialog.visible = true
      getMenu(row.id).then(res => {
        this.$refs.menuTree.setCheckedKeys(res.data)
      })
    },
    handleMenuSubmit() {
      setMenu(this.selectId, this.$refs.menuTree.getCheckedKeys()).then(() => {
        this.closeMenuDialog()
      })
    },
    closeMenuDialog() {
      this.menuDialog.visible = false
      this.$refs.menuTree.setCheckedKeys([])
    },
    // ----- 设置权限 -----
    handlePermission(row) {
      this.selectId = row.id
      this.permissionDialog.visible = true
      getPermission(row.id).then(res => {
        this.$refs.permissionTree.setCheckedKeys(res.data)
      })
    },
    handlePermissionSubmit() {
      setPermission(this.selectId, this.$refs.permissionTree.getCheckedKeys()).then(() => {
        this.closePermissionDialog()
      })
    },
    closePermissionDialog() {
      this.permissionDialog.visible = false
      this.$refs.permissionTree.setCheckedKeys([])
    }
  }
}
</script>
