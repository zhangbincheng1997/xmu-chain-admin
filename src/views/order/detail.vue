<template>
  <div class="app-container">
    <el-card class="box-card">
      <div v-if="orderStatus.length === 0">
        <el-empty description="暂无数据" />
      </div>
      <div v-else>
        <el-button type="primary" icon="el-icon-close" style="float:right;" @click="handleClose">关闭订单</el-button>
        <el-steps direction="vertical" finish-status="success">
          <el-step v-for="(item, i) in orderStatus" :key="i" :title="OrderStatusMap[item.status] + item.createTime" status="success">
            <template v-if="item.status === OrderStatusType.NEW" slot="description">
              <el-descriptions>
                <el-descriptions-item label="订单编号">{{ orderInfo.id }}</el-descriptions-item>
                <el-descriptions-item label="溯源码">
                  <span class="link" @click="linkTrace(orderInfo.code)">{{ orderInfo.code }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="申请数量">{{ orderInfo.count }}</el-descriptions-item>
                <el-descriptions-item label="收货人姓名">{{ orderInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="收货人手机">{{ orderInfo.phone }}</el-descriptions-item>
                <el-descriptions-item label="收货人地址">{{ orderInfo.address }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">
                  <el-tag v-if="orderInfo.status === OrderStatusType.NEW" type="warning">{{ OrderStatusMap[orderInfo.status] }}</el-tag>
                  <el-tag v-if="orderInfo.status === OrderStatusType.TAKE || orderInfo.status === OrderStatusType.SEND">{{ OrderStatusMap[orderInfo.status] }}</el-tag>
                  <el-tag v-if="orderInfo.status === OrderStatusType.RECEIVE" type="success">{{ OrderStatusMap[orderInfo.status] }}</el-tag>
                  <el-tag v-if="orderInfo.status === OrderStatusType.CLOSE_USER || orderInfo.status === OrderStatusType.CLOSE_ADMIN" type="danger">{{ OrderStatusMap[orderInfo.status] }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
              <el-button @click="handleUpdateOrderInfo">修改订单信息</el-button>
              <div v-if="isEditOrderInfo">
                <el-form ref="orderInfoForm" :model="orderInfoForm" label-width="100px">
                  <el-form-item label="溯源码" prop="code" required>
                    <el-input v-model="orderInfoForm.code" />
                  </el-form-item>
                  <el-form-item label="申请数量" prop="count" required>
                    <el-input v-model="orderInfoForm.count" />
                  </el-form-item>
                  <el-form-item label="收货人姓名" prop="name" required>
                    <el-input v-model="orderInfoForm.name" />
                  </el-form-item>
                  <el-form-item label="收货人手机" prop="phone" required>
                    <el-input v-model="orderInfoForm.phone" />
                  </el-form-item>
                  <el-form-item label="收货人地址" prop="address" required>
                    <el-input v-model="orderInfoForm.address" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitOrderInfo">提交</el-button>
                    <el-button @click="isEditOrderInfo = false">取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </template>
            <template v-if="item.status === OrderStatusType.TAKE" slot="description">
              <el-result icon="success" title="已接单" sub-title="订单已经接收" />
            </template>
            <template v-if="item.status === OrderStatusType.SEND" slot="description">
              <el-descriptions>
                <el-descriptions-item label="快递公司">{{ orderExpress.express }}</el-descriptions-item>
                <el-descriptions-item label="快递单号">{{ orderExpress.number }}</el-descriptions-item>
              </el-descriptions>
              <el-button @click="handleUpdateOrderExpress">修改物流信息</el-button>
              <div v-if="isEditOrderExpress">
                <el-form ref="orderExpressForm" :model="orderExpressForm" label-width="100px">
                  <el-form-item label="快递公司" prop="express" required>
                    <el-input v-model="orderExpressForm.express" />
                  </el-form-item>
                  <el-form-item label="快递单号" prop="number" required>
                    <el-input v-model="orderExpressForm.number" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitOrderExpress">提交</el-button>
                    <el-button @click="isEditOrderExpress = false">取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </template>
            <template v-if="item.status === OrderStatusType.RECEIVE" slot="description">
              <el-result icon="success" title="已收货" sub-title="订单已经收货" />
            </template>
            <template v-if="item.status === OrderStatusType.CLOSE_USER || item.status === OrderStatusType.CLOSE_ADMIN" slot="description">
              <el-result icon="error" title="已关闭" sub-title="订单已被取消" />
            </template>
          </el-step>
          <el-step v-if="orderStatus[orderStatus.length-1].status === OrderStatusType.NEW" title="等待接单（管理员）">
            <template slot="description">
              <el-button @click="handleTake">接单</el-button><!-- handle -->
            </template>
          </el-step>
          <el-step v-if="orderStatus[orderStatus.length-1].status === OrderStatusType.TAKE" title="等待发货（管理员）">
            <template slot="description">
              <el-button @click="handleSend">发货</el-button><!-- handle -->
            </template>
          </el-step>
          <el-step v-if="orderStatus[orderStatus.length-1].status === OrderStatusType.SEND" title="等待收货（企业）">
            <template slot="description">
              <el-button @click="handleReceive">收货</el-button><!-- handle -->
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-card>
  </div>
</template>

<script>
import order from '@/api/service-trace/order'
import config from '@/config'

export default {
  data() {
    return {
      selectId: undefined,
      orderInfo: {
        code: undefined,
        count: undefined,
        name: undefined,
        phone: undefined,
        address: undefined,
        status: undefined
      },
      orderInfoForm: {},
      orderExpress: {
        express: undefined,
        number: undefined
      },
      orderExpressForm: {},
      orderStatus: [], // status is list
      isEditOrderInfo: false,
      isEditOrderExpress: false,

      OrderStatusOptions: config.orderStatusOptions,
      OrderStatusMap: config.orderStatusMap,
      OrderStatusType: config.orderStatusType
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.selectId = this.$route.query.id
    }
    this.init()
  },
  methods: {
    init() {
      if (!this.selectId) return
      order.getOrderStatus(this.selectId).then((res) => {
        this.orderStatus = res.data
        order.getOrderInfo(this.selectId).then((res) => { this.orderInfo = res.data })
        order.getOrderExpress(this.selectId).then((res) => { this.orderExpress = res.data })
      })
    },
    handleUpdateOrderInfo() {
      this.isEditOrderInfo = true
      this.orderInfoForm = JSON.parse(JSON.stringify(this.orderInfo))
    },
    submitOrderInfo() {
      this.isEditOrderInfo = false
      order.updateOrder(this.selectId, this.orderInfoForm).then(() => { this.$router.go(0) })
    },
    handleUpdateOrderExpress() {
      this.isEditOrderExpress = true
      this.orderExpressForm = JSON.parse(JSON.stringify(this.orderExpress))
    },
    submitOrderExpress() {
      this.isEditOrderExpress = false
      this.orderExpressForm.id = this.selectId
      order.saveOrUpdateOrderExpress(this.orderExpressForm).then(() => { this.$router.go(0) })
    },
    handleTake() {
      this.$confirm('是否接收订单？', '提示', {
        confirmButtonText: '是的！',
        cancelButtonText: '没呢！',
        type: 'warning'
      }).then(() => {
        order.take(this.selectId).then(() => { this.$router.go(0) })
      })
    },
    handleSend() {
      this.$confirm('是否已经发货？', '提示', {
        confirmButtonText: '是的！',
        cancelButtonText: '没呢！',
        type: 'warning'
      }).then(() => {
        order.send(this.selectId).then(() => { this.$router.go(0) })
      })
    },
    handleReceive() {
      this.$confirm('是否已经收货？', '提示', {
        confirmButtonText: '是的！',
        cancelButtonText: '没呢！',
        type: 'warning'
      }).then(() => {
        order.receive(this.selectId).then(() => { this.$router.go(0) })
      })
    },
    handleClose() {
      this.$confirm('是否关闭订单？', '提示', {
        confirmButtonText: '是的！',
        cancelButtonText: '没呢！',
        type: 'warning'
      }).then(() => {
        order.close(this.selectId).then(() => { this.$router.go(0) })
      })
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
