<template>
  <div class="app-container">
    <BatchInfo />
    <br>
    <el-card>
      <el-tag v-if="form.txId" type="success">已上链：{{ form.txId }}</el-tag>
      <el-button v-has-permission="['CHAIN_PRODUCT']" type="text" :disabled="form.id === undefined" @click="chain(form)">上链</el-button>
      <el-button type="text" style="float: right;" @click="importClick(form)">导入模板</el-button>
      <el-button type="text" style="float: right;" @click="saveTemplate(form)">保存模板</el-button>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="商品名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="商品内容" prop="content">
          <Items :content="form.content" />
        </el-form-item>
        <el-form-item v-has-permission="['EDIT_PRODUCT']">
          <el-button type="primary" @click="submitForm(form)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog title="导入模板" :visible.sync="importVisible">
      <el-select v-model="importId" filterable clearable>
        <el-option v-for="item in templates" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button type="primary" @click="importTemplate">导入</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getProductByBatchId, updateProduct, chain } from '@/api/service-trace/batch/product'
import { allTemplate, addTemplate } from '@/api/service-trace/template/product'
import BatchInfo from '@/components/BatchInfo'
import Items from '@/components/Items'

export default {
  components: {
    BatchInfo,
    Items
  },
  data() {
    return {
      form: {},
      batchId: undefined,
      selectItem: undefined,
      importId: undefined,
      importVisible: false,
      templates: undefined
    }
  },
  mounted() {
    this.batchId = this.$route.query.batchId
    if (!this.batchId) {
      this.$router.push('/trace/batch/admin')
      return
    }
    getProductByBatchId(this.batchId).then(res => {
      this.form = res.data
    })
  },
  methods: {
    submitForm(item) {
      updateProduct(item.id, item).then(() => {})
    },
    importClick(item) {
      this.selectItem = item
      this.importId = undefined
      this.importVisible = true
      if (!this.templates) {
        allTemplate().then(res => {
          this.templates = res.data
        })
      }
    },
    importTemplate() {
      const template = this.templates.filter(item => item.id === this.importId)[0]
      this.selectItem.name = template.name
      this.selectItem.content = template.content
      this.importId = undefined
      this.importVisible = false
    },
    saveTemplate(item) {
      this.$confirm('是否保存模板？', '提示', {
        type: 'warning'
      }).then(() => {
        addTemplate(item).then(() => {
          const template = {
            name: item.name,
            content: item.content
          }
          if (this.templates) {
            this.templates.push(template)
            this.$forceUpdate()
          }
        })
      })
    },
    chain(item) {
      this.$confirm('是否上链？上链后不允许修改！', '提示', {
        type: 'warning'
      }).then(() => {
        chain(item.id).then(res => {
          item.txId = res.data.txId
          this.$forceUpdate()
        })
      })
    }
  }
}
</script>
