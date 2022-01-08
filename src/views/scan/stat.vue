<template>
  <div class="app-container">
    <el-card>
      <batch-complete :no.sync="query.batchNo" :on-finish="search" is-default />
      <el-date-picker v-model="query.start" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" />
      <el-date-picker v-model="query.end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" />
      <el-button icon="el-icon-search" @click="search">查询</el-button>
      <div style="height: 600px; width: 100%; margin-top: 20px;">
        <el-bmap :map-style-v2="mapStyle" :tilt="tilt" :heading="heading" :zoom="zoom" :center="center">
          <el-bmapv-view>
            <el-bmapv-point-layer :data="data" :size="size" :color="color" />
          </el-bmapv-view>
        </el-bmap>
      </div>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import VueBMap from 'vue-bmap-gl' // https://docs.guyixi.cn/vue-bmap-gl/#/
import VueMapvgl from 'vue-mapvgl' // https://docs.guyixi.cn/vue-mapvgl/#/
import 'vue-bmap-gl/dist/style.css'
import config from '@/common'
import { stat } from '@/api/service-trace/scan'

Vue.use(VueBMap)
Vue.use(VueMapvgl)
VueBMap.initBMapApiLoader({
  ak: '4iosGMuqbTMu55Xh0lAa3pBXrCznsu9m',
  v: '1.0'
})

export default {
  data() {
    return {
      loading: false,
      query: {
        page: 1,
        limit: 10,
        batchNo: undefined,
        start: undefined,
        end: undefined
      },
      // bmap
      tilt: 0, // 倾斜角度
      heading: 0, // 旋转角度
      zoom: 5, // 缩放级别
      center: [103.823305441, 36.064225525], // 中心点
      mapStyle: { styleJson: config.whiteStyle }, // 个性化地图
      // point-layer
      size: 20,
      color: 'rgba(128, 0, 128, 0.8)',
      data: [{
        geometry: {
          type: 'Point',
          coordinates: [121.487899486, 31.24916171] // test
        },
        properties: {
          count: 1
        }
      }]
    }
  },
  methods: {
    search() {
      this.loading = true
      stat(this.query).then(res => {
        this.loading = false
        this.data = []
        res.data.forEach(item => {
          this.data.push({
            geometry: {
              type: 'Point',
              coordinates: [item.longitude, item.latitude]
            },
            properties: {
              count: item.count
            }
          })
        })
      })
    }
  }
}
</script>
