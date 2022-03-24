<template>
  <div class="app-container">
    <el-card>
      <el-input v-model="query.keyword" placeholder="请输入关键词" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="企业名称" prop="name" align="center" />
        <el-table-column label="统一社会信用代码" prop="uscc" align="center" />
        <el-table-column label="法人姓名" prop="legalPerson" align="center" />
        <el-table-column label="法人身份证号" prop="legalId" align="center" />
        <el-table-column label="联系方式" prop="contactInfo" align="center" show-overflow-tooltip />
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

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" @click="handleClose">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="企业名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="uscc" required>
          <el-input v-model="form.uscc" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="法人姓名" prop="legalPerson">
              <el-input v-model="form.legalPerson" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人身份证号" prop="legalId">
              <el-input v-model="form.legalId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="联系方式" prop="contactInfo">
          <el-input v-model="form.contactInfo" />
        </el-form-item>
        <el-form-item label="营业执照" prop="businessLicense">
          <UploadImage :image.sync="form.businessLicense" :height="200" />
        </el-form-item>
        <el-form-item v-if="form.id" prop="time">
          <el-tag type="success">创建时间：{{ form.createTime }}</el-tag>
          <el-tag type="warning">更新时间：{{ form.updateTime }}</el-tag>
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
import { gm } from '@/api/service-auth/oauth'
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

      },
      dialog: {
        title: '编辑',
        visible: false
      },
      form: {}
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
        this.list = res.data
        this.total = res.total
      })
    },
    handleSortChange({ column, prop, order }) {
      this.query.sort = order === 'descending' // default ascending
      this.handleQuery()
    },
    handleEdit(row) {
      this.dialog.visible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleSubmit() {
      update(this.form.id, this.form).then(() => {
        this.handleClose()
        this.handleQuery()
      })
    },
    handleClose() {
      this.form = {}
      this.$refs.form.resetFields()
      this.dialog.visible = false
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
      gm(row.id).then(res => {
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
