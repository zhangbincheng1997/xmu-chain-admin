<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="query.keyword" placeholder="ID/NAME" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column label="#" prop="id" align="center" fixed="left" />
        <el-table-column label="产地" prop="place" align="center">
          <template slot-scope="scope">
            <span class="link" @click="link(scope.row.placeId)">{{ getPlaceById(scope.row.placeId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" align="center" />
        <el-table-column label="图片" prop="image" width="100" align="center">
          <template slot-scope="scope"><el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="fill" /></template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
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
        <el-form-item label="产地模板" prop="place" required>
          <el-select v-model="form.placeId" placeholder="请选择">
            <el-option v-for="item in placeTemplateList" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图片" prop="image" required>
          <ImageUpload :image.sync="form.image" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="土壤类型" prop="soilType">
              <el-input v-model="form.soilType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="土壤酸碱度" prop="soilPh">
              <el-input v-model="form.soilPh" />
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
import place from '@/api/template/place'
import plot from '@/api/template/plot'
import config from '@/config'
import ImageUpload from '@/components/Upload/Image'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  keyword: undefined // ID/NAME
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
        placeId: undefined,
        name: undefined,
        image: undefined,
        soilType: undefined,
        soilPh: undefined
      },
      placeTemplateList: [],

      DialogType: config.dialogType,
      DialogTitle: config.dialogTitle
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.query.keyword = this.$route.query.id
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      place.all().then(res => {
        this.placeTemplateList = res.data
        plot.list(this.query).then(res => {
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
    handleEdit(row) {
      this.dialogType = this.DialogType.EDIT
      this.visible = true
      this.selectId = row.id
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(row))
      }) // mounted
    },
    submitForm() {
      if (this.dialogType === this.DialogType.ADD) {
        plot.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === this.DialogType.EDIT) {
        plot.edit(this.selectId, this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      }
    },
    resetForm() {
      this.visible = false
      this.$refs.form.resetFields()
    },
    handleRemove(row) {
      this.$confirm('是否删除？', '提示', {
        type: 'warning'
      }).then(() => {
        plot.remove(row.id).then(() => {
          this.getList()
        })
      })
    },
    link: function(val) {
      router.push({
        path: '/template/place',
        query: {
          id: val
        }
      })
    },
    getPlaceById(id) {
      const place = this.placeTemplateList.find(obj => obj.id === id)
      return place.name + '(' + place.id + ')'
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
