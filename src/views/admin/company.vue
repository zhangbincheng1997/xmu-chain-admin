<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="ID/NAME" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list"
        @sort-change="handleSortChange"
      >
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="标志" prop="logo" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.logo" :preview-src-list="[scope.row.logo]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="名称" prop="name" align="center" />
        <el-table-column label="联系人" prop="contactPerson" align="center" />
        <el-table-column label="联系电话" prop="contactPhone" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="设置" width="60" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handlePwd(scope.row)">密码</el-button>
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
        <el-form-item v-if="dialogType === DialogType.ADD" label="密码" prop="password" required>
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="标志" prop="logo" required>
          <AvatarUpload :avatar.sync="form.logo" />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="form.legalPerson" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系地址" prop="contactAddress">
              <el-input v-model="form.contactAddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="成立日期" prop="foundDate">
              <el-date-picker v-model="form.foundDate" type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="官方网站" prop="officialWebsite">
              <el-input v-model="form.officialWebsite" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="注册号码" prop="registerNumber">
              <el-input v-model="form.registerNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册资本" prop="registerCapital">
              <el-input v-model="form.registerCapital" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="营业范围" prop="businessScope">
          <el-input v-model="form.businessScope" />
        </el-form-item>
        <el-form-item label="营业执照" prop="businessLicense">
          <ImageUpload :image.sync="form.businessLicense" />
        </el-form-item>
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
  </div>
</template>

<script>
import company from '@/api/admin/company'
import config from '@/config'
import AvatarUpload from '@/components/Upload/Avatar'
import ImageUpload from '@/components/Upload/Image'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  keyword: undefined, // ID/NAME
  sort: undefined // ID排序
}

export default {
  components: {
    AvatarUpload,
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
      dialogType: undefined,
      visible: false,
      form: {
        username: undefined,
        password: undefined,
        logo: undefined,
        name: undefined,
        legalPerson: undefined,
        contactPerson: undefined,
        contactPhone: undefined,
        contactAddress: undefined,
        foundDate: undefined,
        officialWebsite: undefined,
        registerNumber: undefined,
        registerCapital: undefined,
        businessScope: undefined,
        businessLicense: undefined
      },

      pwdVisible: false,
      pwdForm: {
        password: undefined
      },

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      company.list(this.query).then(res => {
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
      this.dialogType = this.DialogType.ADD
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
      if (this.dialogType === this.DialogType.ADD) {
        company.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === this.DialogType.EDIT) {
        company.edit(this.selectId, this.form).then(() => {
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
      company.updatePassword(this.selectId, this.pwdForm).then(() => {
        this.resetPwdDialog()
      })
    },
    resetPwdDialog() {
      this.pwdVisible = false
      this.$refs.pwdForm.resetFields()
    },
    handleRemove(row) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        company.remove(row.id).then(() => {
          this.getList()
        })
      })
    }
  }
}
</script>
