<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-select v-model="query.status" placeholder="标签状态" style="width: 200px;" clearable>
        <el-option v-for="item in TagStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="query.id" placeholder="标签编号" style="width: 200px;" clearable />
      <el-input v-model="query.from" placeholder="FROM" style="width: 100px;" clearable />
      <el-input v-model="query.to" placeholder="TO" style="width: 100px;" clearable />
      <el-input v-model="query.code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleGenerate">生成防伪码</el-button>
      <br>
      <span v-if="selectIds.length > 0">
        <el-select v-model="selectStatus" placeholder="标签状态" clearable>
          <el-option v-for="item in TagStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button icon="el-icon-edit" @click="handleStatus">修改状态</el-button>
      </span>
      <el-table
        v-loading="loading"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="标签编号" prop="id" align="center" fixed="left" />
        <el-table-column label="溯源码" prop="code" align="center">
          <template slot-scope="scope">
            <span class="link" @click="linkTrace(scope.row.code)">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="防伪码" prop="securityCode" align="center" />
        <el-table-column label="序号" prop="number" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="标签状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === TagStatusType.NONE" type="info">{{ TagStatusMap[scope.row.status] }}</el-tag>
            <el-tag v-if="scope.row.status === TagStatusType.BIND" type="success">{{ TagStatusMap[scope.row.status] }}</el-tag>
            <el-tag v-if="scope.row.status === TagStatusType.DISCARD" type="warning">{{ TagStatusMap[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </el-card>

    <el-dialog
      :title="DialogTitle[DialogType.GENERATE]"
      :visible.sync="genVisible"
      center
      @close="resetForm"
    >
      <el-form ref="genData" :model="genData" label-width="100px">
        <el-form-item label="溯源码" prop="code" required>
          <el-input v-model="genData.code" />
        </el-form-item>
        <el-form-item label="数量" prop="count" required>
          <el-input v-model="genData.count" />
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
import tag from '@/api/service-trace/tag'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  id: undefined,
  code: undefined,
  from: undefined,
  to: undefined,
  status: undefined
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

      dialogType: undefined,
      visible: false,
      form: {
        id: undefined,
        code: undefined,
        securityCode: undefined,
        number: undefined
      },

      genVisible: false,
      genData: {
        code: undefined,
        count: undefined
      },

      selectIds: [],
      selectStatus: undefined,

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle,
      TagStatusOptions: config.tagStatusOptions,
      TagStatusMap: config.tagStatusMap,
      TagStatusType: config.tagStatusType
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.query.id = this.$route.query.id
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      tag.list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    handleSelectionChange(val) {
      this.selectIds = val.map(item => item.id)
    },
    handleStatus() {
      this.$confirm('是否修改状态？', '提示', {
        type: 'warning'
      }).then(() => {
        tag.status(this.selectIds, this.selectStatus).then(() => {
          this.selectIds = []
          this.selectStatus = undefined
          this.getList()
        })
      })
    },
    handleGenerate() {
      this.genVisible = true
    },
    submitForm() {
      tag.generate(this.genData.code, this.genData.count).then(() => {
        this.resetForm()
        this.getList()
      })
    },
    resetForm() {
      this.genVisible = false
      this.$refs.genData.resetFields()
    },
    linkTrace: function(val) {
      this.$router.push({
        path: '/trace/info',
        query: {
          code: val
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.link {
  color: #0db1c1;
  cursor: pointer;
}
</style>
