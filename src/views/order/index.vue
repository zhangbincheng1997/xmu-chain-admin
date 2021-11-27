<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-select v-model="query.status" placeholder="订单状态" style="width: 200px;" clearable>
        <el-option v-for="item in OrderStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="query.id" placeholder="订单编号" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="getList" />
      </el-input>
      <el-table
        v-loading="loading"
        :data="list"
      >
        <el-table-column label="订单编号" prop="id" align="center" fixed="left" />
        <el-table-column label="溯源码" prop="code" align="center" fixed="left">
          <template slot-scope="scope">
            <span class="link" @click="linkTrace(scope.row.code)">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请数量" prop="count" align="center" />
        <el-table-column label="收货人姓名" prop="name" align="center" />
        <el-table-column label="收货人手机" prop="phone" align="center" />
        <el-table-column label="收货人地址" prop="address" align="center" />
        <el-table-column label="订单状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === OrderStatusType.NEW" type="warning">{{ OrderStatusMap[scope.row.status] }}</el-tag>
            <el-tag v-if="scope.row.status === OrderStatusType.TAKE || scope.row.status === OrderStatusType.SEND">{{ OrderStatusMap[scope.row.status] }}</el-tag>
            <el-tag v-if="scope.row.status === OrderStatusType.RECEIVE" type="success">{{ OrderStatusMap[scope.row.status] }}</el-tag>
            <el-tag v-if="scope.row.status === OrderStatusType.CLOSE_USER || scope.row.status === OrderStatusType.CLOSE_ADMIN" type="danger">{{ OrderStatusMap[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="更新时间" prop="updateTime" align="center" />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="linkDetail(scope.row.id)">详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import { linkTrace, linkDetail } from '@/utils/utils'
import order from '@/api/service-trace/order'
import config from '@/config'
import Pagination from '@/components/Pagination'

// 查询
const defaultQuery = {
  page: 1,
  limit: 10,
  id: undefined,
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

      visible: false,
      form: {
        id: undefined,
        code: undefined,
        count: undefined,
        name: undefined,
        phone: undefined,
        address: undefined,
        status: undefined
      },

      OrderStatusOptions: config.orderStatusOptions,
      OrderStatusMap: config.orderStatusMap,
      OrderStatusType: config.orderStatusType
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.query.id = this.$route.query.id
    }
    if (this.$route.query.code) {
      this.query.status = this.$route.query.status
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      order.list(this.query).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = res.data.total
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
