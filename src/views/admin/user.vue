<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="请输入关键词" prefix-icon="el-icon-search" style="width: 200px" clearable />
      <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button type="primary" icon="el-icon-user" style="float:right;" @click="handleAdd">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
      row-key="id"
      default-expand-all
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" prop="id" width="100" fixed="left" />
      <el-table-column label="头像" align="center" prop="avatar" width="100">
        <template slot-scope="scope"><el-image :src="scope.row.avatar" :fit="fit" /></template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickname" width="100" />
      <el-table-column label="邮箱" align="center" prop="email" width="100" />
      <el-table-column label="性别" align="center" prop="gender" width="100">
        <template slot-scope="scope">{{ genderMap[scope.row.gender] }}</template>
      </el-table-column>
      <el-table-column label="生日" align="center" prop="birthday" width="100" />
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
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="uploadAvatar"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
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
  </div>
</template>

<script>
import { getUserList, addUser, editUser, removeUser } from '@/api/admin'
import { upload } from '@/api/upload'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultListQuery = {
  page: 1,
  limit: 10,
  keyword: undefined, // 关键词
  sort: undefined // ID排序
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
        avatar: '',
        nickname: '',
        email: undefined,
        gender: undefined,
        birthday: undefined
      },
      rules: {
        avatar: [{ required: true, message: '请输入用户头像', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }]
      },
      genderMap: config.genderMap,
      genderOptions: config.genderOptions
    }
  },
  created() {
    this.getList()
  },
  methods: {
    uploadAvatar(param) {
      if (param.file.size > 1024 * 1024 * 10) {
        this.$message.error('上传图片大小不能超过10MB!')
        return
      }
      const formData = new FormData()
      formData.append('file', param.file)
      upload(formData).then(res => {
        this.form.avatar = res.data
      })
    },
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
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
            addUser(this.form).then(res => {
              this.resetForm()
              this.getList()
            })
          } else if (this.dialogType === 'edit') {
            editUser(this.selectId, this.form).then(res => {
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
        removeUser(row.id).then(res => {
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
