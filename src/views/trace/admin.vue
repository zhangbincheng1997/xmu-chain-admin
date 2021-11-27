<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="溯源码" prop="code" width="100" align="center" fixed="left">
          <template slot-scope="scope">
            <span class="link" @click="linkTrace(scope.row.code)">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次编号" prop="batch" align="center" />
        <el-table-column label="商品" prop="productId" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkTemplate('product', scope.row.productId)">{{ getById(productTemplateList, scope.row.productId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="作物" prop="corpId" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkTemplate('corp', scope.row.corpId)">{{ getById(corpTemplateList, scope.row.corpId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产地" prop="placeId" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkTemplate('place', scope.row.placeId)">{{ getById(placeTemplateList, scope.row.placeId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地块" prop="plotId" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkTemplate('plot', scope.row.plotId)">{{ getById(plotTemplateList, scope.row.plotId) }}</span>
          </template>
        </el-table-column>
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
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            <br>
            <el-button type="text" @click="getQRCode(scope.row.code)">二维码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item v-if="form.code" label="溯源码" prop="code" required>
          <el-input v-model="form.code" disabled />
        </el-form-item>
        <el-form-item label="批次编号" prop="batch" required>
          <el-input v-model="form.batch" :disabled="form.code" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作物模板" prop="corpId" required>
              <el-select v-model="form.corpId" placeholder="请选择" :disabled="form.code" @change="handleCorpChange">
                <el-option v-for="item in corpTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.corpId" label="商品模板" prop="productId" required><!-- 需要先选作物 -->
              <el-select v-model="form.productId" placeholder="请选择">
                <el-option v-for="item in productSelectList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产地模板" prop="placeId" required>
              <el-select v-model="form.placeId" placeholder="请选择" :disabled="form.code" @change="handlePlaceChange">
                <el-option v-for="item in placeTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.placeId" label="地块模板" prop="plotId" required><!-- 需要先选产地 -->
              <el-select v-model="form.plotId" placeholder="请选择">
                <el-option v-for="item in plotSelectList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="form.code">
          <el-tag type="success">创建时间：{{ form.createTime }}</el-tag>
          <el-tag type="warning">更新时间：{{ form.updateTime }}</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="qrCodeDialog.title" :visible.sync="qrCodeDialog.visible" @close="qrCode = undefined">
      <el-image :src="qrCode" fit="fill" />
    </el-dialog>
  </div>
</template>

<script>
import { allCorp } from '@/api/service-trace/template/corp'
import { allProduct } from '@/api/service-trace/template/product'
import { allPlace } from '@/api/service-trace/template/place'
import { allPlot } from '@/api/service-trace/template/plot'
import { list, add, update, del } from '@/api/service-trace/trace/admin'
import { getQRCode } from '@/api/service-trace/scan'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        code: undefined
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        code: undefined, // 主键
        batch: undefined,
        corpId: undefined,
        productId: undefined,
        placeId: undefined,
        plotId: undefined,
        userId: undefined,
        transHash: undefined,
        createTime: undefined,
        updateTime: undefined
      },
      corpTemplateList: [],
      productTemplateList: [],
      placeTemplateList: [],
      plotTemplateList: [],
      productSelectList: [],
      plotSelectList: [],

      qrCode: undefined,
      qrCodeDialog: {
        title: undefined,
        visible: false
      }
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
        allCorp().then(res => { this.corpTemplateList = res.data }),
        allProduct().then(res => { this.productTemplateList = res.data }),
        allPlace().then(res => { this.placeTemplateList = res.data }),
        allPlot().then(res => { this.plotTemplateList = res.data })
      ]).then(() => {
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
      const code = this.form.code
      if (code === undefined) {
        add(this.form).then(() => {
          this.closeDialog()
          this.getList()
        })
      } else {
        update(code, this.form).then(() => {
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
        del(row.code).then(() => {
          this.getList()
        })
      })
    },
    getQRCode(code) {
      this.qrCodeDialog = {
        title: '生成二维码',
        visible: true
      }
      getQRCode(code).then((res) => { this.qrCode = res.data })
    },
    getById(list, id) {
      const template = list.find(obj => obj.id === id)
      if (!template) return '???'
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
