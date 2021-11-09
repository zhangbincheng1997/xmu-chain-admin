<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="作物ID/名称" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column label="溯源码" prop="code" align="center" fixed="left" />
        <el-table-column label="作物" prop="corp" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link(scope.row.corpId)">{{ scope.row.corp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地块" prop="plot" align="center" />
        <el-table-column label="批次" prop="batch" align="center" />
        <el-table-column label="种植开始" prop="plantStart" align="center" />
        <el-table-column label="种植结束" prop="plantEnd" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">详细信息</el-button>
            <br>
            <el-button type="text" @click="handleGrow(scope.row)">生长情况</el-button>
            <el-button type="text" @click="handleProduct(scope.row)">商品情况</el-button>
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
        <el-form-item label="作物模板" prop="corp">
          <el-select v-model="form.corp" placeholder="请选择" :disabled="dialogType === DialogType.DETAIL">
            <el-option v-for="item in corpTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地块编号" prop="plot">
              <el-input v-model="form.plot" :disabled="dialogType === DialogType.DETAIL" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批次编号" prop="batch">
              <el-input v-model="form.batch" :disabled="dialogType === DialogType.DETAIL" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="种植开始" prop="plantStart">
              <el-date-picker v-model="form.plantStart" type="date" :disabled="dialogType === DialogType.DETAIL" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="种植结束" prop="plantEnd">
              <el-date-picker v-model="form.plantEnd" type="date" :disabled="dialogType === DialogType.DETAIL" />
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
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  keyword: undefined // ID/NAME
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
        corp: undefined,
        plot: undefined,
        batch: undefined,
        plantStart: undefined,
        plantEnd: undefined
      },
      corpTemplateList: [],

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      corp.list().then(res => {
        // TODO -> all
        this.corpTemplateList = res.data.list
      })
      // getUserList(this.query).then(res => {
      //   this.loading = false
      //   this.list = res.data.list
      //   this.total = res.data.total
      // })
      // test TODO
      this.list = [{ 'code': '00000001', 'corpId': '1', 'corpName': '生菜', 'corp': '生菜(1)', 'plot': '1', 'batch': '1', 'plantStart': '2020-01-01', 'plantEnd': '2020-01-01' }]
      this.loading = false
    },
    handleAdd() {
      this.dialogType = this.DialogType.EDIT
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
    handleGrow(row) {
      router.push({
        path: '/trace/grow',
        query: {
          corpId: row.corpId
        }
      })
    },
    handleProduct(row) {
      router.push({
        path: '/trace/product',
        query: {
          corpId: row.corpId
        }
      })
    },
    link: function(val) {
      router.push({
        path: '/template/corp',
        query: {
          corpId: val
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
