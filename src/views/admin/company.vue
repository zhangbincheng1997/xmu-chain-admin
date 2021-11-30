<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="ID/NAME" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="标志" prop="logo" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.logo" :preview-src-list="[scope.row.logo]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="名称" prop="name" align="center" />
        <el-table-column label="法人" prop="legalPerson" align="center" />
        <el-table-column label="联系人" prop="contactPerson" align="center" />
        <el-table-column label="联系电话" prop="contactPhone" align="center" />
        <el-table-column label="联系地址" prop="contactAddress" align="contactAddress" show-overflow-tooltip />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleGM(scope.row)">进入后台</el-button>
            <br>
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
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
import { gm } from '@/api/oauth'
import { list, update, del } from '@/api/service-admin/company'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        keyword: undefined,
        sort: false
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        id: undefined,
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
        businessLicense: undefined,
        createTime: undefined,
        updateTime: undefined
      }
    }
  },
  mounted() {
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
    handleSortChange({ column, prop, order }) {
      this.query.sort = order === 'descending' // default ascending
      this.handleQuery()
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
      update(id, this.form).then(() => {
        this.closeDialog()
        this.handleQuery()
      })
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
    handleGM(row) {
      // Token换取Key
      gm(row.id).then((res) => {
        // Key换取Token
        this.$store.dispatch('user/exchange', res.data).then(() => {
          this.$store.dispatch('user/resetRouter')
          this.$router.push('/dashboard')
        })
      })
    }
  }
}
</script>
