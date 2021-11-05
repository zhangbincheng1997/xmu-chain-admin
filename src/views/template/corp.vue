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
      >
        <el-table-column label="#" prop="id" align="center" fixed="left" />
        <el-table-column label="名称" prop="name" align="center" />
        <el-table-column label="图片" prop="image" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.image" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
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
      center
      @close="resetForm"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图片" prop="image" required>
          <ImageUpload :image.sync="form.image" />
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="育苗周期" prop="yumiao">
            <el-input v-model="form.yumiao" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="灌溉周期" prop="guangai">
            <el-input v-model="form.guangai" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="施肥周期" prop="shifei">
            <el-input v-model="form.shifei" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="除草周期" prop="chucao">
            <el-input v-model="form.chucao" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import corp from '@/api/template/corp'
import config from '@/config'
import ImageUpload from '@/components/Upload/Image'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  keyword: undefined // ID/名称
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
        name: undefined,
        image: undefined,
        yumiao: undefined,
        guangai: undefined,
        shifei: undefined,
        chucao: undefined
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      corp.list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
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
        corp.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === config.EDIT) {
        corp.edit(this.selectId, this.form).then(() => {
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
        corp.remove(row.id).then(() => {
          this.getList()
        })
      })
    }
  }
}
</script>
