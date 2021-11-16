<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column label="#" prop="id" width="50" align="center" fixed="left" />
        <el-table-column label="溯源码" prop="code" width="100" align="center" fixed="left">
          <template slot-scope="scope">
            <span class="link" @click="linkTrace(scope.row.code)">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="image" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="内容" prop="content" align="center" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">详细信息</el-button>
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
      <div v-if="dialogType === DialogType.ADD">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="溯源码" prop="code" required>
            <el-input v-model="form.code" />
          </el-form-item>
          <el-form-item label="图片" prop="image">
            <ImageUpload :image.sync="form.image" />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input v-model="form.content" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-if="dialogType === DialogType.DETAIL">
        <el-descriptions :title="'# ' + form.id + ' - ' + form.createTime">
          <el-descriptions-item label="内容">{{ form.content }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ form.remark }}</el-descriptions-item>
        </el-descriptions>
        <el-image v-if="form.image" :src="form.image" :preview-src-list="[form.image]" style="width: 100px; height: 100px" fit="contain" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import router from '@/router'
import process from '@/api/trace/process'
import config from '@/config'
import ImageUpload from '@/components/Upload/Image'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  code: undefined // 溯源码
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
      dialogType: undefined,
      visible: false,
      form: {
        code: undefined,
        image: undefined,
        content: undefined,
        remark: undefined
      },

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle
    }
  },
  mounted() {
    if (this.$route.query.code) {
      this.query.code = this.$route.query.code
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      process.list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleAdd() {
      this.dialogType = this.DialogType.ADD
      this.visible = true
      this.form = {}
    },
    handleDetail(row) {
      this.dialogType = this.DialogType.DETAIL
      this.visible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    submitForm() {
      if (this.dialogType === this.DialogType.ADD) {
        process.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === this.DialogType.DETAIL) {
        this.resetForm()
      }
    },
    resetForm() {
      this.visible = false
      this.$refs.form.resetFields()
    },
    linkTrace: function(val) {
      router.push({
        path: '/trace/info',
        query: {
          code: val
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.link {
  color: #0db1c1;
  cursor: pointer;
}
</style>
