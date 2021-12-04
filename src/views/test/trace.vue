<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="render" />
      </el-input>
      <div v-if="!template">
        <el-empty description="暂无数据" />
      </div>
      <div v-else>
        <el-tabs type="border-card">
          <el-tab-pane label="查询结果">
            <div v-if="isOk">
              <el-result icon="success" title="校验成功" sub-title="该证据自上链之日起未被篡改！">
                <template slot="extra">
                  <el-button type="primary" @click="handleCheck">在 线 校 验</el-button>
                </template>
              </el-result>
            </div>
            <div v-else>
              <el-result icon="error" title="校验错误" sub-title="该证据发生篡改，请通知工作人员！">
                <template slot="extra">
                  <el-button type="primary" @click="handleCheck">在 线 校 验</el-button>
                </template>
              </el-result>
            </div>
          </el-tab-pane>
          <el-tab-pane label="上链信息">
            <el-tabs tab-position="left">
              <el-tab-pane label="商品信息">
                <el-form label-width="100px">
                  <el-form-item label="图片"><image-preview :image="productTemplate.image" /></el-form-item>
                  <el-form-item label="名称">{{ productTemplate.name }}</el-form-item>
                  <el-form-item label="介绍">{{ productTemplate.content }}</el-form-item>
                  <el-form-item label="价格">{{ productTemplate.price }}</el-form-item>
                  <el-form-item label="重量">{{ productTemplate.weight }}</el-form-item>
                  <el-form-item label="过期时间">{{ productTemplate.exp }}</el-form-item>
                  <el-form-item label="交易哈希"><copy-hash :text="productTemplate.transHash" /></el-form-item>
                  <el-form-item label="发送方"><copy-from :text="productTemplate.transFrom" /></el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="产地信息">
                <el-form label-width="100px">
                  <el-form-item label="图片"><image-preview :image="placeTemplate.image" /></el-form-item>
                  <el-form-item label="名称">{{ placeTemplate.name }}</el-form-item>
                  <el-form-item label="地址">{{ placeTemplate.address }}</el-form-item>
                  <el-form-item label="介绍">{{ placeTemplate.content }}</el-form-item>
                  <el-form-item label="面积">{{ placeTemplate.area }}</el-form-item>
                  <el-form-item label="海拔">{{ placeTemplate.altitude }}</el-form-item>
                  <el-form-item label="交易哈希"><copy-hash :text="placeTemplate.transHash" /></el-form-item>
                  <el-form-item label="发送方"><copy-from :text="placeTemplate.transFrom" /></el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="地块信息">
                <el-form label-width="100px">
                  <el-form-item label="图片"><image-preview :image="plotTemplate.image" /></el-form-item>
                  <el-form-item label="名称">{{ plotTemplate.name }}</el-form-item>
                  <el-form-item label="土壤类型">{{ plotTemplate.soilType }}</el-form-item>
                  <el-form-item label="土壤酸碱度">{{ plotTemplate.soilPh }}</el-form-item>
                  <el-form-item label="交易哈希"><copy-hash :text="plotTemplate.transHash" /></el-form-item>
                  <el-form-item label="发送方"><copy-from :text="plotTemplate.transFrom" /></el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="企业信息">
                <el-form label-width="100px">
                  <el-form-item label="标志"><image-preview :image="companyInfo.logo" /></el-form-item>
                  <el-form-item label="名称">{{ companyInfo.name }}</el-form-item>
                  <el-form-item label="法人">{{ companyInfo.legalPerson }}</el-form-item>
                  <el-form-item label="联系人">{{ companyInfo.contactPerson }}</el-form-item>
                  <el-form-item label="联系电话">{{ companyInfo.contactPhone }}</el-form-item>
                  <el-form-item label="联系地址">{{ companyInfo.contactAddress }}</el-form-item>
                  <el-form-item label="成立日期">{{ companyInfo.foundDate }}</el-form-item>
                  <el-form-item label="官方网站">{{ companyInfo.officialWebsite }}</el-form-item>
                  <el-form-item label="注册号码">{{ companyInfo.registerNumber }}</el-form-item>
                  <el-form-item label="注册资本">{{ companyInfo.registerCapital }}</el-form-item>
                  <el-form-item label="营业范围">{{ companyInfo.businessScope }}</el-form-item>
                  <el-form-item label="营业执照"><image-preview :image="companyInfo.businessLicense" /></el-form-item>
                  <el-form-item label="交易哈希"><copy-hash :text="companyInfo.transHash" /></el-form-item>
                  <el-form-item label="发送方"><copy-from :text="companyInfo.transFrom" /></el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="上链操作">
            <el-tabs tab-position="left">
              <el-tab-pane label="生长操作">
                <div v-for="(item, i) in growList" :key="item.id">
                  <el-descriptions :title="'# ' + (i+1) + ': ' + item.createTime">
                    <el-descriptions-item label="温度">{{ item.temperature }}</el-descriptions-item>
                    <el-descriptions-item label="湿度">{{ item.humidity }}</el-descriptions-item>
                    <el-descriptions-item label="光照">{{ item.light }}</el-descriptions-item>
                    <el-descriptions-item label="备注">{{ item.remark }}</el-descriptions-item>
                    <el-descriptions-item label="交易哈希"><copy-hash :text="item.transHash" /></el-descriptions-item>
                    <el-descriptions-item label="发送方"><copy-from :text="item.transFrom" /></el-descriptions-item>
                  </el-descriptions>
                  <image-preview :image="item.image" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="农事操作">
                <div v-for="(item, i) in farmList" :key="item.id">
                  <el-descriptions :title="'# ' + (i+1) + ': ' + item.createTime">
                    <el-descriptions-item label="内容">{{ item.content }}</el-descriptions-item>
                    <el-descriptions-item label="备注">{{ item.remark }}</el-descriptions-item>
                    <el-descriptions-item label="交易哈希"><copy-hash :text="item.transHash" /></el-descriptions-item>
                    <el-descriptions-item label="发送方"><copy-from :text="item.transFrom" /></el-descriptions-item>
                  </el-descriptions>
                  <image-preview :image="item.image" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="加工操作">
                <div v-for="(item, i) in processList" :key="item.id">
                  <el-descriptions :title="'# ' + (i+1) + ': ' + item.createTime">
                    <el-descriptions-item label="内容">{{ item.content }}</el-descriptions-item>
                    <el-descriptions-item label="备注">{{ item.remark }}</el-descriptions-item>
                    <el-descriptions-item label="交易哈希"><copy-hash :text="item.transHash" /></el-descriptions-item>
                    <el-descriptions-item label="发送方"><copy-from :text="item.transFrom" /></el-descriptions-item>
                  </el-descriptions>
                  <image-preview :image="item.image" />
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getProductById } from '@/api/service-trace/trace/product'
import { getPlaceById } from '@/api/service-trace/trace/place'
import { getPlotById } from '@/api/service-trace/trace/plot'
import { getCompanyById } from '@/api/service-admin/company'
import { getInfoByCode } from '@/api/service-trace/trace/info'
import { listGrowByCode } from '@/api/service-trace/trace/op/grow'
import { listFarmByCode } from '@/api/service-trace/trace/op/farm'
import { listProcessByCode } from '@/api/service-trace/trace/op/process'

export default {
  data() {
    return {
      code: undefined,
      template: undefined,
      productTemplate: {},
      placeTemplate: {},
      plotTemplate: {},
      companyInfo: {},
      growList: [],
      farmList: [],
      processList: [],
      isOk: true
    }
  },
  mounted() {
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    }
    this.render()
  },
  methods: {
    render() {
      console.log(this.code)
      if (!this.code) return
      getInfoByCode(this.code).then(res => {
        this.template = res.data
        console.log(this.template)
        if (!this.template) return
        // trace
        getProductById(this.template.productId).then(res => { this.productTemplate = res.data })
        getPlaceById(this.template.placeId).then(res => { this.placeTemplate = res.data })
        getPlotById(this.template.plotId).then(res => { this.plotTemplate = res.data })
        getCompanyById(this.template.companyId).then(res => { this.companyInfo = res.data })
        // trace op
        listGrowByCode(this.code).then(res => { this.growList = res.data })
        listFarmByCode(this.code).then(res => { this.farmList = res.data })
        listProcessByCode(this.code).then(res => { this.processList = res.data })
      })
    },
    handleCheck() {
      this.isOk = !this.isOk
    }
  }
}
</script>
