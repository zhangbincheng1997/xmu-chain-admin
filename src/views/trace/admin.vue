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
        <el-table-column label="溯源码" prop="code" width="100" align="center" fixed="left">
          <template slot-scope="scope">
            <span class="link" @click="linkTrace(scope.row.code)">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次" prop="batch" align="center" />
        <el-table-column label="作物" prop="corpId" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link('corp', scope.row.corpId)">{{ getById(placeTemplateList, scope.row.corpId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品" prop="productId" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link('product', scope.row.productId)">{{ getById(productTemplateList, scope.row.productId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产地" prop="placeId" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link('place', scope.row.placeId)">{{ getById(placeTemplateList, scope.row.placeId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地块" prop="plotId" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link('plot', scope.row.plotId)">{{ getById(plotTemplateList, scope.row.plotId) }}</span>
          </template>
        </el-table-column>
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
        <el-form-item v-if="dialogType === DialogType.DETAIL" label="溯源码" prop="code" required>
          <el-input v-model="form.code" disabled />
        </el-form-item>
        <el-form-item label="批次编号" prop="batch" required>
          <el-input v-model="form.batch" :disabled="dialogType === DialogType.DETAIL" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作物模板" prop="corpId" required>
              <el-select v-model="form.corpId" placeholder="请选择" :disabled="dialogType === DialogType.DETAIL" @change="handleCorpChange">
                <el-option v-for="item in corpTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.corpId" label="商品模板" prop="productId" required>
              <el-select v-model="form.productId" placeholder="请选择" :disabled="dialogType === DialogType.DETAIL">
                <el-option v-for="item in productSelectList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产地模板" prop="placeId" required>
              <el-select v-model="form.placeId" placeholder="请选择" :disabled="dialogType === DialogType.DETAIL" @change="handlePlaceChange">
                <el-option v-for="item in placeTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.placeId" label="地块模板" prop="plotId" required>
              <el-select v-model="form.plotId" placeholder="请选择" :disabled="dialogType === DialogType.DETAIL">
                <el-option v-for="item in plotSelectList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
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
import corp from '@/api/template/corp'
import product from '@/api/template/product'
import place from '@/api/template/place'
import plot from '@/api/template/plot'
import admin from '@/api/trace/admin'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  code: undefined // 溯源码
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
        code: undefined,
        batch: undefined,
        corpId: undefined,
        productId: undefined,
        placeId: undefined,
        plotId: undefined
      },
      corpTemplateList: [],
      productTemplateList: [],
      placeTemplateList: [],
      plotTemplateList: [],
      productSelectList: [],
      plotSelectList: [],

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
      Promise.all([
        corp.all().then(res => { this.corpTemplateList = res.data }),
        product.all().then(res => { this.productTemplateList = res.data }),
        place.all().then(res => { this.placeTemplateList = res.data }),
        plot.all().then(res => { this.plotTemplateList = res.data })
      ]).then(() => {
        admin.list(this.query).then(res => {
          this.loading = false
          this.list = res.data.list
          this.total = res.data.total
        })
      })
    },
    handleAdd() {
      this.dialogType = this.DialogType.ADD
      this.visible = true
    },
    handleDetail(row) {
      this.dialogType = this.DialogType.DETAIL
      this.visible = true
      this.selectId = row.id
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(row))
      }) // mounted
    },
    submitForm() {
      if (this.dialogType === this.DialogType.ADD) {
        admin.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === this.DialogType.DETAIL) {
        admin.edit(this.selectId, this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      }
    },
    resetForm() {
      this.visible = false
      this.$refs.form.resetFields()
    },
    link: function(type, val) {
      router.push({
        path: '/template/' + type,
        query: {
          id: val
        }
      })
    },
    linkTrace: function(val) {
      router.push({
        path: '/trace/info',
        query: {
          code: val
        }
      })
    },
    getById(list, id) {
      const template = list.find(obj => obj.id === id)
      return template.name + '(' + template.id + ')'
    },
    handleCorpChange(val) {
      this.form.productId = undefined
      this.productSelectList = this.productTemplateList.filter(obj => obj.corpId === val)
    },
    handlePlaceChange(val) {
      this.form.plotId = undefined
      this.plotSelectList = this.plotTemplateList.filter(obj => obj.placeId === val)
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
