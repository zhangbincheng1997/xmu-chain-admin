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
      >
        <el-table-column label="#" prop="id" align="center" fixed="left" />
        <el-table-column label="名称" prop="name" align="center" />
        <el-table-column label="图片" prop="image" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="介绍" prop="content" width="200" align="center" show-overflow-tooltip />
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
      :title="DialogTitle[dialogType]"
      :visible.sync="visible"
      center
      @close="resetForm"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图片" prop="image" required>
          <AvatarUpload :avatar.sync="form.image" />
        </el-form-item>
        <el-form-item label="介绍" prop="content">
          <el-input v-model="form.content" type="textarea" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重量" prop="weight">
              <el-input v-model="form.weight" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保质期" prop="exp">
              <el-input v-model="form.exp" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import product from '@/api/template/product'
import config from '@/config'
import AvatarUpload from '@/components/Upload/Avatar'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  keyword: undefined // ID/NAME
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
        name: undefined,
        content: undefined,
        image: undefined,
        price: undefined,
        weight: undefined,
        exp: undefined
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
      product.list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
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
        product.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === this.DialogType.EDIT) {
        product.edit(this.selectId, this.form).then(() => {
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
        product.remove(row.id).then(() => {
          this.getList()
        })
      })
    }
  }
}
</script>
