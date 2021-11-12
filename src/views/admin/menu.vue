<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-button type="primary" icon="el-icon-plus" style="float:right;" @click="handleAdd">添加</el-button>
      <el-table
        v-loading="loading"
        :data="list.slice((query.page-1)*query.limit,query.page*query.limit)"
        row-key="id"
        default-expand-all
      >
        <el-table-column label="#" prop="id" width="100" align="center" fixed="left" />
        <el-table-column label="菜单名字" prop="name" align="center" />
        <el-table-column label="菜单路径" prop="url" align="center" />
        <el-table-column label="菜单图标" prop="icon" align="center">
          <template slot-scope="scope"><i :class="scope.row.icon" /></template>
        </el-table-column>
        <el-table-column label="菜单排序" prop="sort" align="center" />
        <!--<el-table-column label="父节点PID" prop="pid" align="center" />-->
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" />
    </el-card>

    <el-dialog
      :title="DialogTitle[dialogType]"
      :visible.sync="visible"
      width="30%"
      center
      @close="resetForm"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="菜单名字" prop="name" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="url" required>
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="form.icon" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input v-model="form.sort" />
        </el-form-item>
        <el-form-item label="父节点" prop="pid">
          <el-cascader
            v-model="form.pid"
            placeholder="默认根节点"
            :options="list"
            :props="{ value: 'id', label: 'name', expandTrigger: 'hover', emitPath: false, checkStrictly: true }"
            :show-all-levels="false"
          />
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
import menu from '@/api/admin/menu'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10
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
        name: undefined,
        url: undefined,
        icon: undefined,
        sort: undefined,
        pid: undefined
      },

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
      menu.tree().then(res => {
        this.loading = false
        this.list = res.data
        this.total = this.list.length
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
        menu.add(this.form).then(() => {
          this.resetForm()
          this.getList()
        })
      } else if (this.dialogType === this.DialogType.EDIT) {
        menu.edit(this.selectId, this.form).then(() => {
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
        menu.remove(row.id).then(() => {
          this.getList()
        })
      })
    }
  }
}
</script>
