<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-date-picker v-model="query.start" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" />
      <el-date-picker v-model="query.end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" />
      <el-input v-model="query.code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table ref="refTable" v-loading="loading" :data="list" @row-click="handleRowClick">
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
        <el-table-column label="用户地址" prop="fromAddr" align="center" show-overflow-tooltip>
          <template slot-scope="scope"><copy-user :text="scope.row.fromAddr" /></template>
        </el-table-column>
        <el-table-column label="交易哈希" prop="transHash" align="center" show-overflow-tooltip>
          <template slot-scope="scope"><copy-trans :text="scope.row.transHash" /></template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            <br>
            <el-button type="text" @click="linkOperate(scope.row.code)">溯源操作</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item v-if="form.code" label="溯源码" prop="code" required>
          <el-input v-model="form.code" disabled />
        </el-form-item>
        <el-form-item label="批次编号" prop="batch" required>
          <el-input v-model="form.batch" />
        </el-form-item>
        <el-form-item label="商品" prop="productId" required>
          <el-select v-model="form.productId" placeholder="请选择">
            <el-option v-for="item in productTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产地" prop="placeId" required>
              <el-select v-model="form.placeId" placeholder="请选择" @change="handlePlaceChange">
                <el-option v-for="item in placeTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.placeId" label="地块" prop="plotId" required><!-- 需要先选产地 -->
              <el-select v-model="form.plotId" placeholder="请选择" @change="$forceUpdate()"><!-- 强制刷新 -->
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

    <el-dialog
      :title="qrCodeDialog.title"
      :visible.sync="qrCodeDialog.visible"
      center
      width="300px"
      height="300px"
      @close="qrCode = undefined"
    >
      <el-image :src="qrCode" fit="fill" />
    </el-dialog>
  </div>
</template>

<script>
import { allProduct } from '@/api/service-trace/trace/product'
import { allPlace } from '@/api/service-trace/trace/place'
import { allPlot } from '@/api/service-trace/trace/plot'
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
        code: undefined,
        start: undefined,
        end: undefined
      },
      dialog: {
        title: undefined,
        visible: false
      },
      form: {
        code: undefined, // 主键
        batch: undefined,
        productId: undefined,
        placeId: undefined,
        plotId: undefined,
        fromAddr: undefined,
        transHash: undefined,
        createTime: undefined,
        updateTime: undefined
      },
      productTemplateList: [],
      placeTemplateList: [],
      plotTemplateList: [],
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
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      this.loading = true
      Promise.all([
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
        title: '添加',
        visible: true
      }
    },
    handleEdit(row) {
      this.resetForm()
      this.dialog = {
        title: '修改',
        visible: true
      }
      this.handlePlaceChange(row.placeId) // 产地模板限制地块模板
      this.form = JSON.parse(JSON.stringify(row))
    },
    handleSubmit() {
      const code = this.form.code
      if (code === undefined) {
        add(this.form).then(() => {
          this.closeDialog()
          this.handleQuery()
        })
      } else {
        update(code, this.form).then(() => {
          this.closeDialog()
          this.handleQuery()
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
          this.handleQuery()
        })
      })
    },
    handleRowClick: function(row, column, $event) {
      const nodeName = $event.target.nodeName
      if (nodeName === 'I') return // copyText
      this.qrCodeDialog = {
        title: '生成二维码',
        visible: true
      }
      getQRCode(row.code).then((res) => { this.qrCode = res.data })
    },
    linkOperate(code) {
      this.$router.push({
        path: '/trace/operate',
        query: {
          code: code
        }
      })
    },
    linkTemplate(type, val) {
      this.$router.push({
        path: '/template/' + type,
        query: {
          id: val
        }
      })
    },
    getById(list, id) {
      const template = list.find(obj => obj.id === id)
      if (!template) return '???'
      return template.name + '(' + template.id + ')'
    },
    handlePlaceChange(val) {
      this.form.plotId = undefined
      this.plotSelectList = this.plotTemplateList.filter(obj => obj.placeId === val)
    }
  }
}
</script>
