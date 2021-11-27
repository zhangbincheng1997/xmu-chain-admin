import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 全局组件挂载
import Pagination from '@/components/Pagination'
import AvatarUpload from '@/components/Upload/Avatar'
import ImageUpload from '@/components/Upload/Image'
Vue.component('Pagination', Pagination)
Vue.component('AvatarUpload', AvatarUpload)
Vue.component('ImageUpload', ImageUpload)

// 全局指令挂载
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 全局方法挂载
import { copyText, linkTransaction, linkTemplate, linkTrace, linkDetail } from '@/utils/utils'
Vue.prototype.copyText = copyText
Vue.prototype.linkTransaction = linkTransaction
Vue.prototype.linkTemplate = linkTemplate
Vue.prototype.linkTrace = linkTrace
Vue.prototype.linkDetail = linkDetail

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
