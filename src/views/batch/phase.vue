<template>
  <div class="app-container">
    <BatchInfo />
    <br>
    <el-card>
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item v-for="(item, i) in list" :key="i" :name="i.toString()">
          <template slot="title">
            <el-tag v-if="item.id">{{ item.name }}</el-tag>
            <i v-if="item.id" class="el-icon-delete" style="margin-left: 20px;" @click="handleDelete(item.id)">删除</i>
          </template>
          <el-tag v-if="item.txId" type="success">已上链：{{ item.txId }}</el-tag>
          <el-button v-else type="text" :disabled="item.id === undefined" @click="chain(item)">上链</el-button>
          <el-button type="text" style="float: right;" @click="importClick(item)">导入模板</el-button>
          <el-button type="text" style="float: right;" @click="saveTemplate(item)">保存模板</el-button>
          <el-form ref="form" :model="item" label-width="100px">
            <el-form-item label="环节名称" prop="name" required>
              <el-input v-model="item.name" />
            </el-form-item>
            <el-form-item label="环节内容" prop="content">
              <Items :content.sync="item.content" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm(item)">保存</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <div style="text-align: center">
          <el-button type="text" @click="addContent">新增环节</el-button>
        </div>
      </el-collapse>
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
import { getPhaseByBatchId, addPhase, updatePhase, delPhase, chain } from '@/api/service-trace/batch/phase'
import { allTemplate, addTemplate } from '@/api/service-trace/template/phase'
import BatchInfo from '@/components/BatchInfo'
import Items from '@/components/Items'

export default {
  components: {
    BatchInfo,
    Items
  },
  data() {
    return {
      list: [],
      batchId: undefined,
      selectItem: undefined,
      importId: undefined,
      importVisible: false,
      templates: undefined,

      // 当前展开的折叠面板
      activeNames: undefined
    }
  },
  mounted() {
    this.batchId = this.$route.query.batchId
    if (!this.batchId) {
      this.$router.push('/trace/batch/admin')
      return
    }
    getPhaseByBatchId(this.batchId).then(res => {
      this.list = res.data
      // 展开最后一项
      if (this.list.length > 0) this.activeNames = (this.list.length - 1).toString()
    })
  },
  methods: {
    submitForm(item) {
      updatePhase(item.id, item).then(() => {})
    },
    handleDelete(id) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        delPhase(id).then(res => {
          this.$router.go(0) // 刷新
        })
      })
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
        addTemplate(item).then(res => {
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
        chain(item.id).then((res) => {
          item.txId = res.data.txId
          this.$forceUpdate()
        })
      })
    },
    // ----- 新增环节 -----
    addContent() {
      const item = {
        batchId: this.batchId, // 关联
        name: '新增环节',
        content: undefined
      }
      addPhase(item).then((res) => {
        item.id = res.data // 环节ID
        this.list.push(item)
        // 展开新增环节
        this.activeNames = (this.list.length - 1).toString()
      })
    }
  }
}
</script>
