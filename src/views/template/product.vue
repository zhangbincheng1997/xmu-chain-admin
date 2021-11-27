<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="ID/NAME" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="#" prop="id" width="50" align="center" fixed="left" />
        <el-table-column label="作物" prop="product" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkTemplate('corp', scope.row.corpId)">{{ getCorpById(scope.row.corpId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" align="center" />
        <el-table-column label="图片" prop="image" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="介绍" prop="content" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="操作用户ID" prop="userId" align="center" />
        <el-table-column label="交易Hash" prop="transHash" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="copyText" @click="copyText(scope.row.transHash)" />
            <span class="link" @click="linkTransaction(scope.row.transHash)">{{ scope.row.transHash }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="作物模板" prop="corpId" required>
          <el-select v-model="form.corpId" placeholder="请选择">
            <el-option v-for="item in corpTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="image" required>
          <ImageUpload :image.sync="form.image" />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="form.name" />
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
        <el-form-item v-if="form.id">
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
import { list, add, update, del } from '@/api/service-trace/template/product'
import { allCorp } from '@/api/service-trace/template/corp'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        keyword: undefined
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        id: undefined,
        corpId: undefined,
        name: undefined,
        image: undefined,
        content: undefined,
        price: undefined,
        weight: undefined,
        exp: undefined,
        userId: undefined,
        transHash: undefined,
        createTime: undefined,
        updateTime: undefined
      },
      corpTemplateList: []
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.query.keyword = this.$route.query.id
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      allCorp().then(res => {
        this.corpTemplateList = res.data
        list(this.query).then(res => {
          this.loading = false
          this.list = res.data.list
          this.total = res.data.total
        })
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
    getCorpById(id) {
      const corp = this.corpTemplateList.find(obj => obj.id === id)
      return corp.name + '(' + corp.id + ')'
    }
  }
}
</script>
