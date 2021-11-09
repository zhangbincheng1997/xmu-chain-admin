<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.corpId" placeholder="作物ID" style="width: 200px;" clearable />
      <el-input v-model="query.growId" placeholder="生长ID" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column label="生长ID" prop="id" align="center" fixed="left" />
        <el-table-column label="图片" prop="image" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="温度" prop="temperature" align="center" />
        <el-table-column label="水分" prop="water" align="center" />
        <el-table-column label="光照" prop="light" align="center" />
        <el-table-column label="气体" prop="gas" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
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
        <el-form-item label="图片" prop="image">
          <div v-if="dialogType === DialogType.ADD"><ImageUpload :image.sync="form.image" /></div>
          <div v-if="dialogType === DialogType.DETAIL"><el-image :src="form.image" :preview-src-list="[form.image]" fit="fill" /></div>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="温度" prop="temperature">
              <el-input v-model="form.temperature" :disabled="dialogType === DialogType.DETAIL" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水分" prop="water">
              <el-input v-model="form.water" :disabled="dialogType === DialogType.DETAIL" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="光照" prop="light">
              <el-input v-model="form.light" :disabled="dialogType === DialogType.DETAIL" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="气体" prop="gas">
              <el-input v-model="form.gas" :disabled="dialogType === DialogType.DETAIL" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" :disabled="dialogType === DialogType.DETAIL" />
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
// import { } from '@/api/'
import config from '@/config'
import ImageUpload from '@/components/Upload/Image'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  corpId: undefined, // 作物ID
  growId: undefined // 生长ID
}

export default {
  components: {
    ImageUpload,
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
        image: undefined,
        temperature: undefined,
        water: undefined,
        light: undefined,
        gas: undefined,
        remark: undefined
      },

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
      // getUserList(this.query).then(res => {
      //   this.loading = false
      //   this.list = res.data.list
      //   this.total = res.data.total
      // })
      // test TODO
      this.list = [{ 'id': '100', 'temperature': '1', 'water': '2', 'light': '3', 'gas': '4', 'remark': '无', 'createTime': '2020-01-01', 'image': 'http://www.littleredhat1997.com:8090/ipfs/QmYTMerJcBZxgkvKrzRw2iLcPJkDLVGUEkvi3odMkZLLiA?imageView2/1/w/80/h/80' }]
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
    }
  }
}
</script>
