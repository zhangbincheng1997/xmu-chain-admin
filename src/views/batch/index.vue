<template>
  <div class="app-container">
    <el-alert title="注：同一批次下的商品的溯源信息是一样的，如果溯源信息不一样请分不同批次。" type="warning" />
    <br>
    <el-card>
      <el-input v-model="query.keyword" placeholder="请输入关键词" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleQuery" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加批次</el-button>
      <el-table v-loading="loading" :data="list" @sort-change="handleSortChange">
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" sortable="custom" />
        <el-table-column label="批次号" prop="no" align="center">
          <template slot-scope="scope">
            <i class="el-icon-copy-document" title="复制" @click="copyText(scope.row.no)" />
            <span class="link" @click="linkTagRecord(scope.row.no)">{{ scope.row.no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="productName" align="center" />
        <el-table-column label="店铺信息" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleShop(scope.row)">配置</el-button>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleProduct(scope.row)">配置</el-button>
          </template>
        </el-table-column>
        <el-table-column label="环节信息" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handlePhase(scope.row)">配置</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-text="启用" inactive-text="禁用" @change="handleSwitchChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="handleQuery" />
    </el-card>

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="handleClose">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="批次号" prop="no" required>
          <el-input v-model="form.no" />
        </el-form-item>
        <!-- 添加可以选择商品模板；编辑不可以选择商品模板 -->
        <el-form-item v-if="!form.id" label="商品模板" prop="productId" required>
          <el-select v-model="form.productId" filterable clearable>
            <el-option v-for="item in productTemplates" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.id" prop="time">
          <el-tag type="success">创建时间：{{ form.createTime }}</el-tag>
          <el-tag type="warning">更新时间：{{ form.updateTime }}</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="shopDialog.title" :visible.sync="shopDialog.visible" @close="handleShopClose">
      <el-form ref="shopForm" :model="shopForm" label-width="100px">
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="shopForm.name" />
        </el-form-item>
        <el-form-item label="店铺说明" prop="content">
          <el-input v-model="shopForm.content" />
        </el-form-item>
        <el-form-item label="店铺图标" prop="icon">
          <UploadImage :image.sync="shopForm.icon" />
        </el-form-item>
        <el-form-item label="店铺链接" prop="url">
          <el-input v-model="shopForm.url" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleShopSubmit">确 定</el-button>
        <el-button @click="handleShopClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, add, del, updateShop, status } from '@/api/service-trace/batch'
import { allTemplate } from '@/api/service-trace/template/product'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        keyword: undefined,
        sort: false
      },
      dialog: {
        title: '批次配置',
        visible: false
      },
      form: {},

      shopDialog: {
        title: '店铺配置',
        visible: false
      },
      shopForm: {},

      productTemplates: []
    }
  },
  mounted() {
    this.init()
    this.handleQuery()
  },
  methods: {
    init() {
      allTemplate().then(res => {
        this.productTemplates = res.data
      })
    },
    handleQuery() {
      this.loading = true
      list(this.query).then(res => {
        this.loading = false
        this.list = res.data
        this.total = res.total
      })
    },
    handleSortChange({ column, prop, order }) {
      this.query.sort = order === 'descending' // default ascending
      this.handleQuery()
    },
    handleAdd() {
      this.dialog.visible = true
    },
    handleSubmit() {
      add(this.form).then(() => {
        this.handleClose()
        this.handleQuery()
      })
    },
    handleClose() {
      this.form = {}
      this.$refs.form.resetFields()
      this.dialog.visible = false
    },
    handleDelete(row) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        del(row.id).then(() => {
          this.handleQuery()
        })
      })
    },
    // ----- 修改状态 -----
    handleSwitchChange(row) {
      status(row.id, row.status).then(() => {})
    },
    // ----- 配置店铺信息 -----
    handleShop(row) {
      this.shopForm = row.shopInfo ? JSON.parse(row.shopInfo) : {}
      this.shopForm.id = row.id
      this.shopDialog.visible = true
    },
    handleShopSubmit() {
      updateShop(this.shopForm.id, this.shopForm).then(() => {
        this.handleShopClose()
        this.handleQuery()
      })
    },
    handleShopClose() {
      this.shopForm = {}
      this.$refs.shopForm.resetFields()
      this.shopDialog.visible = false
    },
    // ----- 配置商品信息 -----
    handleProduct(row) {
      this.$router.push({
        path: '/batch/product',
        query: {
          batchId: row.id
        }
      })
    },
    // ----- 配置环节信息 -----
    handlePhase(row) {
      this.$router.push({
        path: '/batch/phase',
        query: {
          batchId: row.id
        }
      })
    },
    // ----- 跳转标签记录 -----
    linkTagRecord(val) {
      this.$router.push({
        path: '/tag/record',
        query: {
          batchNo: val
        }
      })
    }
  }
}
</script>
