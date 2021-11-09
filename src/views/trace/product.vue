<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.corpId" placeholder="作物ID" style="width: 200px;" clearable />
      <el-input v-model="query.product" placeholder="商品ID/名称" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column label="溯源码" prop="code" align="center" fixed="left" />
        <el-table-column label="商品" prop="product" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link(scope.row.productId)">{{ scope.row.product }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入厂时间" prop="inTime" align="center" />
        <el-table-column label="出厂时间" prop="outTime" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">详细信息</el-button>
            <br>
            <el-button type="text" @click="handleProcess(scope.row)">加工情况</el-button>
            <el-button type="text" @click="handleTransport(scope.row)">物流情况</el-button>
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
        <el-form-item v-if="dialogType === DialogType.DETAIL" label="溯源码" prop="code">
          <el-input v-model="form.code" disabled />
        </el-form-item>
        <el-form-item label="商品模板" prop="product">
          <el-select v-model="form.product" placeholder="请选择" :disabled="dialogType === DialogType.DETAIL">
            <el-option v-for="item in productTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入厂时间" prop="inTime">
              <el-date-picker v-model="form.inTime" type="date" :disabled="dialogType === DialogType.DETAIL" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂时间" prop="outTime">
              <el-date-picker v-model="form.outTime" type="date" :disabled="dialogType === DialogType.DETAIL" />
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
import router from '@/router'
import product from '@/api/template/product'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  corpId: undefined, // 作物ID
  product: undefined // 商品ID/名称
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
        product: undefined,
        inTime: undefined,
        outTime: undefined
      },
      productTemplateList: [],

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle
    }
  },
  mounted() {
    if (this.$route.query.corpId) {
      this.query.corpId = this.$route.query.corpId
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      product.list().then(res => {
        // TODO -> all
        this.productTemplateList = res.data.list
      })
      // getUserList(this.query).then(res => {
      //   this.loading = false
      //   this.list = res.data.list
      //   this.total = res.data.total
      // })
      // test TODO
      this.list = [{ 'code': '00000001', 'productId': '1', 'productName': '扶贫一号生菜', 'product': '扶贫一号生菜(1)', 'inTime': '2020-01-01', 'outTime': '2020-01-01' }]
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
    },
    handleProcess(row) {
      router.push({
        path: '/trace/process',
        query: {
          productId: row.productId
        }
      })
    },
    handleTransport(row) {
      router.push({
        path: '/trace/transport',
        query: {
          productId: row.productId
        }
      })
    },
    link: function(val) {
      router.push({
        path: '/template/product',
        query: {
          productId: val
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.link {
  color: royalblue;
  cursor: pointer;
}
</style>
