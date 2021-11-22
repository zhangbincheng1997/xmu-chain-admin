<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="render" />
      </el-input>
      <el-divider>查 询 结 果</el-divider>
      <div v-if="!template">
        <el-empty description="暂无数据" />
      </div>
      <div v-else>
        <el-tabs type="border-card">
          <el-tab-pane label="企业信息">
            <el-form label-width="100px">
              <el-form-item label="图片"><el-image v-if="companyInfo.logo" :src="companyInfo.logo" :preview-src-list="[companyInfo.logo]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
              <el-form-item label="名称"><span>{{ companyInfo.name }}</span></el-form-item>
              <el-form-item label="法人"><span>{{ companyInfo.legalPerson }}</span></el-form-item>
              <el-form-item label="联系人"><span>{{ companyInfo.contactPerson }}</span></el-form-item>
              <el-form-item label="联系电话"><span>{{ companyInfo.contactPhone }}</span></el-form-item>
              <el-form-item label="联系地址"><span>{{ companyInfo.contactAddress }}</span></el-form-item>
              <el-form-item label="成立日期"><span>{{ companyInfo.foundDate }}</span></el-form-item>
              <el-form-item label="官方网站"><span>{{ companyInfo.officialWebsite }}</span></el-form-item>
              <el-form-item label="注册号码"><span>{{ companyInfo.registerNumber }}</span></el-form-item>
              <el-form-item label="注册资本"><span>{{ companyInfo.registerCapital }}</span></el-form-item>
              <el-form-item label="营业范围"><span>{{ companyInfo.businessScope }}</span></el-form-item>
              <el-form-item label="营业执照"><el-image v-if="companyInfo.businessLicense" :src="companyInfo.businessLicense" :preview-src-list="[companyInfo.businessLicense]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品信息">
            <el-form label-width="100px">
              <el-form-item label="图片"><el-image v-if="productTemplate.image" :src="productTemplate.image" :preview-src-list="[productTemplate.image]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
              <el-form-item label="名称"><span>{{ productTemplate.name }}</span></el-form-item>
              <el-form-item label="介绍"><span>{{ productTemplate.content }}</span></el-form-item>
              <el-form-item label="价格"><span>{{ productTemplate.price }}</span></el-form-item>
              <el-form-item label="重量"><span>{{ productTemplate.weight }}</span></el-form-item>
              <el-form-item label="过期时间"><span>{{ productTemplate.exp }}</span></el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="作物信息">
            <el-form label-width="100px">
              <el-form-item label="图片"><el-image v-if="corpTemplate.image" :src="corpTemplate.image" :preview-src-list="[corpTemplate.image]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
              <el-form-item label="名称"><span>{{ corpTemplate.name }}</span></el-form-item>
              <el-form-item label="灌溉周期"><span>{{ corpTemplate.guangai }}</span></el-form-item>
              <el-form-item label="施肥周期"><span>{{ corpTemplate.shifei }}</span></el-form-item>
              <el-form-item label="除草周期"><span>{{ corpTemplate.chucao }}</span></el-form-item>
              <el-form-item label="除虫周期"><span>{{ corpTemplate.chuchong }}</span></el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="产地信息">
            <el-form label-width="100px">
              <el-form-item label="图片"><el-image v-if="placeTemplate.image" :src="placeTemplate.image" :preview-src-list="[placeTemplate.image]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
              <el-form-item label="名称"><span>{{ placeTemplate.name }}</span></el-form-item>
              <el-form-item label="地址"><span>{{ placeTemplate.address }}</span></el-form-item>
              <el-form-item label="介绍"><span>{{ placeTemplate.content }}</span></el-form-item>
              <el-form-item label="面积"><span>{{ placeTemplate.area }}</span></el-form-item>
              <el-form-item label="海拔"><span>{{ placeTemplate.altitude }}</span></el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="地块信息">
            <el-form label-width="100px">
              <el-form-item label="图片"><el-image v-if="plotTemplate.image" :src="plotTemplate.image" :preview-src-list="[plotTemplate.image]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
              <el-form-item label="名称"><span>{{ plotTemplate.name }}</span></el-form-item>
              <el-form-item label="土壤类型"><span>{{ plotTemplate.soilType }}</span></el-form-item>
              <el-form-item label="土壤酸碱度"><span>{{ plotTemplate.soilPh }}</span></el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="生长情况">
            <div v-for="item in growList" :key="item.id">
              <el-descriptions :title="'# ' + item.id + ' - ' + item.createTime">
                <el-descriptions-item label="温度">{{ item.temperature }}</el-descriptions-item>
                <el-descriptions-item label="湿度">{{ item.humidity }}</el-descriptions-item>
                <el-descriptions-item label="光照">{{ item.light }}</el-descriptions-item>
                <el-descriptions-item label="备注">{{ item.remark }}</el-descriptions-item>
              </el-descriptions>
              <el-image :src="item.image" :preview-src-list="[item.image]" style="width: 100px; height: 100px" fit="contain" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="农事情况">
            <div v-for="item in farmList" :key="item.id">
              <el-descriptions :title="'# ' + item.id + ' - ' + item.createTime">
                <el-descriptions-item label="内容">{{ item.content }}</el-descriptions-item>
                <el-descriptions-item label="备注">{{ item.remark }}</el-descriptions-item>
              </el-descriptions>
              <el-image :src="item.image" :preview-src-list="[item.image]" style="width: 100px; height: 100px" fit="contain" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="加工情况">
            <div v-for="item in processList" :key="item.id">
              <el-descriptions :title="'# ' + item.id + ' - ' + item.createTime">
                <el-descriptions-item label="内容">{{ item.content }}</el-descriptions-item>
                <el-descriptions-item label="备注">{{ item.remark }}</el-descriptions-item>
              </el-descriptions>
              <el-image :src="item.image" :preview-src-list="[item.image]" style="width: 100px; height: 100px" fit="contain" />
            </div>
          </el-tab-pane>
        </el-tabs>
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
      </div>
    </el-card>
  </div>
</template>

<script>
import company from '@/api/admin/company'
import corp from '@/api/template/corp'
import product from '@/api/template/product'
import place from '@/api/template/place'
import plot from '@/api/template/plot'
import admin from '@/api/trace/admin'
import grow from '@/api/trace/grow'
import farm from '@/api/trace/farm'
import process from '@/api/trace/process'

export default {
  data() {
    return {
      code: undefined,
      template: undefined,
      companyInfo: {},
      corpTemplate: {},
      productTemplate: {},
      placeTemplate: {},
      plotTemplate: {},
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
      admin.getByCode(this.code).then(res => {
        this.template = res.data
        console.log(this.template)
        if (!this.template) return
        // template 模板
        company.getById(this.template.companyId).then(res => { this.companyInfo = res.data })
        corp.getById(this.template.corpId).then(res => { this.corpTemplate = res.data })
        product.getById(this.template.productId).then(res => { this.productTemplate = res.data })
        place.getById(this.template.placeId).then(res => { this.placeTemplate = res.data })
        plot.getById(this.template.plotId).then(res => { this.plotTemplate = res.data })
        // trace 溯源
        grow.listByCode(this.code).then(res => { this.growList = res.data })
        farm.listByCode(this.code).then(res => { this.farmList = res.data })
        process.listByCode(this.code).then(res => { this.processList = res.data })
      })
    },
    handleCheck() {
      this.isOk = !this.isOk
    }
  }
}
</script>
<style lang="scss" scoped>
span {
  color: #727476;
}
</style>
