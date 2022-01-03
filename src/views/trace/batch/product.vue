<template>
  <div class="app-container">
    <BatchInfo />
    <br>
    <el-card class="box-card">
      <div style="width: 100%;">
        <el-tag v-if="form.txId" type="success">已上链：{{ form.txId }}</el-tag>
        <el-button v-else type="text" @click="chain(form.id)">上链</el-button>
        <el-button type="text" style="float: right;" @click="importVisible = true">导入模板</el-button>
        <el-button type="text" style="float: right;" @click="saveTemplate">保存模板</el-button>
        <el-divider />
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="商品名称" prop="name" required>
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="商品内容" prop="content">
            <Items :content="form.content" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="back">返 回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-dialog title="导入模板" :visible.sync="importVisible">
      <el-select v-model="importId" filterable clearable>
        <el-option v-for="item in productTemplates" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button type="primary" @click="importTemplate">导入</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getProductByBatchId, update, chain } from '@/api/service-trace/batch/product'
import { allProduct, add } from '@/api/service-trace/template/product'
import BatchInfo from '@/components/BatchInfo'
import Items from '@/components/Items'

export default {
  components: {
    BatchInfo,
    Items
  },
  data() {
    return {
      form: {
        id: undefined,
        name: undefined,
        content: undefined,
        txId: undefined
      },

      importId: undefined,
      importVisible: false,
      productTemplates: []
    }
  },
  mounted() {
    const batchId = this.$route.query.batchId
    getProductByBatchId(batchId).then(res => {
      this.form = res.data
    })
    allProduct().then(res => {
      this.productTemplates = res.data
    })
  },
  methods: {
    submitForm() {
      update(this.form.id, this.form).then(() => {
        this.back()
      })
    },
    importTemplate() {
      const template = this.productTemplates.filter(item => item.id === this.importId)[0]
      this.form.name = template.name
      this.form.content = template.content
      this.importVisible = false
    },
    saveTemplate() {
      this.$confirm('是否保存模板？', '提示', {
        type: 'warning'
      }).then(() => {
        add(this.form).then(res => {})
      })
    },
    chain(id) {
      this.$confirm('是否上链？上链后不允许修改！', '提示', {
        type: 'warning'
      }).then(() => {
        chain(id).then((res) => {
          this.form.txId = res.data.txId
          this.$forceUpdate()
        })
      })
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
