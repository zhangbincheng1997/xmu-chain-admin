<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-input v-model="code" placeholder="溯源码" style="width: 300px;" clearable>
        <el-button slot="append" icon="el-icon-search" @click="render" />
      </el-input>
      <el-divider>查 询 结 果</el-divider>
      <el-tabs type="border-card">
        <el-tab-pane label="链上信息">
          <el-form label-width="100px">
            <el-form-item label="区块高度"><span>123456</span></el-form-item>
            <el-form-item label="交易哈希"><span>0x...</span></el-form-item>
            <el-form-item label="上链机构"><span>0x...</span></el-form-item>
            <el-form-item label="上链时间"><span>2021-03-14</span></el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="作物信息">
          <el-form label-width="100px">
            <el-form-item label="名称"><span>{{ corpTemplate.name }}</span></el-form-item>
            <el-form-item label="图片"><el-image :src="corpTemplate.image" :preview-src-list="[corpTemplate.image]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
            <el-form-item label="灌溉周期"><span>{{ corpTemplate.guangai }}</span></el-form-item>
            <el-form-item label="施肥周期"><span>{{ corpTemplate.shifei }}</span></el-form-item>
            <el-form-item label="除草周期"><span>{{ corpTemplate.chucao }}</span></el-form-item>
            <el-form-item label="除虫周期"><span>{{ corpTemplate.chuchong }}</span></el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品信息">
          <el-form label-width="100px">
            <el-form-item label="名称"><span>{{ productTemplate.name }}</span></el-form-item>
            <el-form-item label="图片"><el-image :src="productTemplate.image" :preview-src-list="[productTemplate.image]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
            <el-form-item label="介绍"><span>{{ productTemplate.content }}</span></el-form-item>
            <el-form-item label="价格"><span>{{ productTemplate.price }}</span></el-form-item>
            <el-form-item label="重量"><span>{{ productTemplate.weight }}</span></el-form-item>
            <el-form-item label="过期时间"><span>{{ productTemplate.exp }}</span></el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="产地信息">
          <el-form label-width="100px">
            <el-form-item label="名称"><span>{{ placeTemplate.name }}</span></el-form-item>
            <el-form-item label="图片"><el-image :src="placeTemplate.image" :preview-src-list="[placeTemplate.image]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
            <el-form-item label="地址"><span>{{ placeTemplate.address }}</span></el-form-item>
            <el-form-item label="介绍"><span>{{ placeTemplate.content }}</span></el-form-item>
            <el-form-item label="面积"><span>{{ placeTemplate.area }}</span></el-form-item>
            <el-form-item label="海拔"><span>{{ placeTemplate.altitude }}</span></el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="地块信息">
          <el-form label-width="100px">
            <el-form-item label="名称"><span>{{ plotTemplate.name }}</span></el-form-item>
            <el-form-item label="图片"><el-image :src="plotTemplate.image" :preview-src-list="[plotTemplate.image]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
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
        <el-tab-pane label="物流情况">
          <div v-for="item in transportList" :key="item.id">
            <el-descriptions :title="'# ' + item.id + ' - ' + item.createTime">
              <el-descriptions-item label="地点">{{ item.location }}</el-descriptions-item>
              <el-descriptions-item label="经度">{{ item.longitude }}</el-descriptions-item>
              <el-descriptions-item label="纬度">{{ item.latitude }}</el-descriptions-item>
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
    </el-card>
  </div>
</template>

<script>
import corp from '@/api/template/corp'
import product from '@/api/template/product'
import place from '@/api/template/place'
import plot from '@/api/template/plot'
import admin from '@/api/trace/admin'
import grow from '@/api/trace/grow'
import farm from '@/api/trace/farm'
import process from '@/api/trace/process'
import transport from '@/api/trace/transport'

export default {
  data() {
    return {
      code: '1458798686464114688',
      corpTemplate: {},
      productTemplate: {},
      placeTemplate: {},
      plotTemplate: {},
      growList: [],
      farmList: [],
      processList: [],
      transportList: [],
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
      if (this.code === undefined) return
      admin.getByCode(this.code).then(res => {
        const template = res.data
        console.log(template)
        // template 模板
        corp.getById(template.corpId).then(res => { this.corpTemplate = res.data })
        product.getById(template.productId).then(res => { this.productTemplate = res.data })
        place.getById(template.placeId).then(res => { this.placeTemplate = res.data })
        plot.getById(template.plotId).then(res => { this.plotTemplate = res.data })
        // trace 溯源
        grow.listByCode(this.code).then(res => { this.growList = res.data })
        farm.listByCode(this.code).then(res => { this.farmList = res.data })
        process.listByCode(this.code).then(res => { this.processList = res.data })
        transport.listByCode(this.code).then(res => { this.transportList = res.data })
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
  color: forestgreen;
}
</style>
