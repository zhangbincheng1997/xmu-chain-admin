<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-select v-model="query.roleId" placeholder="角色" style="width: 200px;" clearable>
        <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-input v-model="query.keyword" placeholder="请输入关键词" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加员工</el-button>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="头像" prop="avatar" width="100" align="center">
          <template slot-scope="scope"><image-preview :image="scope.row.avatar" /></template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" align="center" />
        <el-table-column label="手机" prop="phone" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="地址" prop="address" align="center" show-overflow-tooltip>
          <template slot-scope="scope"><copy-from :text="scope.row.address" /></template>
        </el-table-column>
        <el-table-column label="设置" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handlePwd(scope.row)">密码</el-button>
            <el-button type="text" @click="handleRole(scope.row)">角色</el-button>
            <br>
            <el-switch v-model="scope.row.enabled" active-color="#13ce66" inactive-color="#ff4949" @change="handleEnabled(scope.row)" />
          </template>
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

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item v-if="form.id" label="地址" prop="address" required>
          <el-input v-model="form.address" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="账号" prop="username" required>
          <el-input v-model="form.username" autocomplete="off" :disabled="form.id !== undefined" />
        </el-form-item>
        <el-form-item v-if="!form.id" label="密码" prop="password" required>
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机" prop="phone" required>
              <el-input v-model="form.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email" required>
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="form.id" label="头像" prop="avatar">
          <AvatarUpload :avatar.sync="form.avatar" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.id" label="生日" prop="birthday">
              <el-date-picker v-model="form.birthday" type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.id" label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio v-for="item in genderOptions" :key="item.value" :label="item.label">{{ item.value }}</el-radio>
              </el-radio-group>
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

    <el-dialog :title="roleDialog.title" :visible.sync="roleDialog.visible">
      <el-tree
        ref="tree"
        :data="roleData"
        show-checkbox
        check-strictly
        default-expand-all
        node-key="id"
        :props="{ label: 'name' }"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRoleSubmit">确 定</el-button>
        <el-button @click="closeRoleDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, add, update, del, updatePassword, getRole, setRole, enabled } from '@/api/service-admin/user'
import { listRole } from '@/api/service-admin/role'
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
        sort: false,
        keyword: undefined,
        roleId: undefined
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        id: undefined,
        address: undefined,
        username: undefined,
        password: undefined,
        name: undefined,
        phone: undefined,
        email: undefined,
        avatar: undefined,
        gender: undefined,
        birthday: undefined,
        enabled: undefined,
        createTime: undefined,
        updateTime: undefined
      },

      roleDialog: {
        title: '设置角色',
        visible: false
      },
      roleData: undefined,

      genderOptions: config.genderOptions
    }
  },
  mounted() {
    this.init()
    this.handleQuery()
  },
  methods: {
    init() {
      listRole().then(res => {
        this.roleData = res.data
      })
    },
    handleQuery() {
      this.loading = true
      list(this.query).then(res => {
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
    // ----- 重置密码 -----
    handlePwd(row) {
      this.$prompt('请输入新密码', '提示', {
        inputValidator: (input) => { return input && input.length >= 3 && input.length <= 12 },
        inputErrorMessage: '新密码长度为3-12'
      }).then(({ value }) => {
        updatePassword(row.id, value).then(() => {})
      })
    },
    // ----- 设置角色 -----
    handleRole(row) {
      this.selectId = row.id
      this.roleDialog.visible = true
      getRole(this.selectId).then(res => {
        this.$refs.tree.setCheckedKeys(res.data)
      })
    },
    handleRoleSubmit() {
      setRole(this.selectId, this.$refs.tree.getCheckedKeys()).then(() => {
        this.closeRoleDialog()
      })
    },
    closeRoleDialog() {
      this.roleDialog.visible = false
      this.$refs.tree.setCheckedKeys([])
    },
    // ----- 修改状态 -----
    handleEnabled(row) {
      enabled(row.id, row.enabled).then(() => {})
    }
  }
}
</script>
