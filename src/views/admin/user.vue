<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="ID/名称" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list"
        @sort-change="handleSortChange"
      >
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="头像" prop="avatar" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.avatar" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname" width="200" align="center" />
        <el-table-column label="手机" prop="phone" width="200" align="center" />
        <el-table-column label="邮箱" prop="email" width="200" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="设置" width="60" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleRole(scope.row)">角色</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </el-card>

    <el-dialog
      :title="dialogTitle[dialogType]"
      :visible.sync="visible"
      width="30%"
      center
      @close="resetForm"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="头像" prop="avatar" required>
          <ImageUpload :image.sync="form.avatar" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" required>
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio v-for="item in genderOptions" :key="item.label" :label="item.label">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="form.birthday" type="date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="设置角色"
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
import user from '@/api/admin/user'
import role from '@/api/admin/role'
import config from '@/config'
import ImageUpload from '@/components/Upload/Image'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  keyword: undefined, // ID/名称
  sort: undefined // ID排序
}

export default {
  components: {
    ImageUpload,
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
        avatar: undefined,
        nickname: undefined,
        phone: undefined,
        email: undefined,
        gender: undefined,
        birthday: undefined
      },
      genderOptions: config.genderOptions,

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
      user.list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleSortChange({ column, prop, order }) {
      this.query.sort = order === 'descending' // default ascending
      this.getList()
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
        user.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === config.EDIT) {
        user.edit(this.selectId, this.form).then(() => {
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
        user.remove(row.id).then(() => {
          this.getList()
        })
      })
    },
    handleRole(row) {
      role.list().then(res => {
        this.roleData = res.data
        user.getRole(row.id).then(res => {
          this.$refs.tree.setCheckedKeys(res.data)
        })
      })
      this.roleVisible = true
      this.selectId = row.id
    },
    submitRoleDialog() {
      user.setRole(this.selectId, this.$refs.tree.getCheckedKeys()).then(() => {
        this.resetRoleDialog()
      })
    },
    resetRoleDialog() {
      this.roleVisible = false
      this.roleData = undefined
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
