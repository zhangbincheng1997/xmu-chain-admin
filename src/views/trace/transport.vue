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
        <el-table-column label="溯源码" prop="code" width="100" align="center" fixed="left" />
        <el-table-column label="图片" prop="image" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="地点" prop="location" align="center" />
        <el-table-column label="经度" prop="longitude" align="center" />
        <el-table-column label="纬度" prop="latitude" align="center" />
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
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="溯源码" prop="code" required>
          <el-input v-model="form.code" :disabled="dialogType === DialogType.DETAIL" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <div v-if="dialogType === DialogType.ADD"><ImageUpload :image.sync="form.image" /></div>
          <div v-if="dialogType === DialogType.DETAIL"><el-image :src="form.image" :preview-src-list="[form.image]" fit="fill" /></div>
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" :disabled="dialogType === DialogType.DETAIL" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" :disabled="dialogType === DialogType.DETAIL" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" :disabled="dialogType === DialogType.DETAIL" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" :disabled="dialogType === DialogType.DETAIL" />
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
import transport from '@/api/trace/transport'
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
        location: undefined,
        longitude: undefined,
        latitude: undefined,
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
      transport.list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleAdd() {
      this.dialogType = this.DialogType.ADD
      this.visible = true
    },
    handleDetail(row) {
      this.dialogType = this.DialogType.DETAIL
      this.visible = true
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(row))
      }) // mounted
    },
    submitForm() {
      if (this.dialogType === this.DialogType.ADD) {
        transport.add(this.form).then(() => {
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
    }
  }
}
</script>
