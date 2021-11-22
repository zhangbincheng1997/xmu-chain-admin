<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-select v-model="query.roleId" placeholder="角色" style="width: 200px;" clearable>
        <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-input v-if="true" v-model="query.companyId" placeholder="企业Id" style="width: 200px;" clearable />
      <el-input v-model="query.keyword" placeholder="ID/NAME" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加员工</el-button>
      <el-table
        v-loading="loading"
        :data="list"
        @sort-change="handleSortChange"
      >
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column v-if="isSuperAdmin" label="企业ID" prop="companyId" align="center" />
        <el-table-column label="头像" prop="avatar" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="账号" prop="username" align="center" />
        <el-table-column label="姓名" prop="name" align="center" />
        <el-table-column label="手机" prop="phone" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="设置" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handlePwd(scope.row)">密码</el-button>
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
      :title="DialogTitle[dialogType]"
      :visible.sync="visible"
      center
      @close="resetForm"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="账号" prop="username" required>
          <el-input v-model="form.username" autocomplete="off" :disabled="dialogType === DialogType.EDIT" />
        </el-form-item>
        <el-form-item v-if="dialogType === DialogType.ADD_MEMBER" label="密码" prop="password" required>
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar" required>
          <AvatarUpload :avatar.sync="form.avatar" />
        </el-form-item>
        <el-form-item label="姓名" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker v-model="form.birthday" type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio v-for="item in genderOptions" :key="item.value" :label="item.label">{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="DialogTitle[DialogType.PWD]"
      :visible.sync="pwdVisible"
      width="30%"
      center
      @close="resetPwdDialog"
    >
      <el-form ref="pwdForm" :model="pwdForm" label-width="100px">
        <el-form-item label="密码" prop="password" required>
          <el-input v-model="pwdForm.password" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPwdDialog">确 定</el-button>
        <el-button @click="resetPwdDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="DialogTitle[DialogType.ROLE]"
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
import user from '@/api/service-admin/user'
import role from '@/api/service-admin/role'
import config from '@/config'
import AvatarUpload from '@/components/Upload/Avatar'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  roleId: undefined,
  companyId: undefined,
  keyword: undefined,
  sort: undefined
}

export default {
  components: {
    AvatarUpload,
    Pagination
  },
  data() {
    return {
      loading: false,
      query: Object.assign({}, defaultQuery),
      list: [],
      total: 0,

      selectId: undefined,
      dialogType: undefined,
      visible: false,
      form: {
        username: undefined,
        avatar: undefined,
        name: undefined,
        phone: undefined,
        email: undefined,
        gender: undefined,
        birthday: undefined
      },

      pwdVisible: false,
      pwdForm: {
        password: undefined
      },

      roleVisible: false,
      roleData: undefined,

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle,
      genderOptions: config.genderOptions
    }
  },
  mounted() {
    this.init()
    this.getList()
  },
  methods: {
    init() {
      role.list().then(res => {
        this.roleData = res.data
      })
    },
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
      this.dialogType = this.DialogType.ADD_MEMBER
      this.visible = true
    },
    handleEdit(row) {
      this.dialogType = this.DialogType.EDIT
      this.visible = true
      this.selectId = row.id
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(row))
      }) // mounted
    },
    submitForm() {
      if (this.dialogType === this.DialogType.ADD_MEMBER) {
        user.saveCompanyMember(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === this.DialogType.EDIT) {
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
    handlePwd(row) {
      this.pwdVisible = true
      this.selectId = row.id
    },
    submitPwdDialog() {
      user.updatePassword(this.selectId, this.pwdForm).then(() => {
        this.resetPwdDialog()
      })
    },
    resetPwdDialog() {
      this.pwdVisible = false
      this.$refs.pwdForm.resetFields()
    },
    handleRole(row) {
      user.getRole(row.id).then(res => {
        this.roleVisible = true
        this.selectId = row.id
        this.$refs.tree.setCheckedKeys(res.data)
      })
    },
    submitRoleDialog() {
      user.setRole(this.selectId, this.$refs.tree.getCheckedKeys()).then(() => {
        this.resetRoleDialog()
      })
    },
    resetRoleDialog() {
      this.roleVisible = false
      this.$refs.tree.setCheckedKeys([])
    },
    handleRemove(row) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        user.remove(row.id).then(() => {
          this.getList()
        })
      })
    }
  }
}
</script>
