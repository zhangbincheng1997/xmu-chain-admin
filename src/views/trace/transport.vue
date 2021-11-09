<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.productId" placeholder="商品ID" style="width: 200px;" clearable />
      <el-input v-model="query.transportId" placeholder="物流ID" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column label="物流ID" prop="id" align="center" fixed="left" />
        <el-table-column label="出发地" prop="start" align="center" />
        <el-table-column label="目的地" prop="end" align="center" />
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
        <el-form-item label="出发地" prop="start">
          <el-input v-model="form.start" :disabled="dialogType === DialogType.DETAIL" />
        </el-form-item>
        <el-form-item label="目的地" prop="end">
          <el-input v-model="form.end" :disabled="dialogType === DialogType.DETAIL" />
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
// import { } from '@/api/'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  productId: undefined, // 商品ID
  transportId: undefined // 物流ID
}

export default {
  components: {
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
        start: undefined,
        end: undefined,
        remark: undefined
      },

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle
    }
  },
  mounted() {
    if (this.$route.query.productId) {
      this.query.productId = this.$route.query.productId
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      // getUserList(this.query).then(res => {
      //   this.loading = false
      //   this.list = res.data.list
      //   this.total = res.data.total
      // })
      // test TODO
      this.list = [{ 'id': '00000001', 'start': '广州', 'end': '深圳', 'remark': '备注', 'createTime': '2020-01-01' }]
      this.loading = false
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
        // TODO
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
