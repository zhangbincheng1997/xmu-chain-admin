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

// 剪贴板功能
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 图标选择功能
import eIconPicker from 'e-icon-picker'
import 'e-icon-picker/lib/symbol.js' // 基本彩色图标库
import 'e-icon-picker/lib/index.css' // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css' // font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css' // element-ui 图标库
// Vue.use(eIconPicker, { FontAwesome: true, ElementUI: true, eIcon: true, eIconSymbol: true })
Vue.use(eIconPicker, { ElementUI: true })

// 全局组件挂载
import Pagination from '@/components/Pagination'
import AvatarUpload from '@/components/Upload/Avatar'
import ImageUpload from '@/components/Upload/Image'
import ImagePreview from '@/components/ImagePreview'
import CodeComplete from '@/components/CodeComplete'
import CopyFrom from '@/components/Copy/From'
import CopyHash from '@/components/Copy/Hash'
Vue.component('Pagination', Pagination)
Vue.component('AvatarUpload', AvatarUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)
Vue.component('CodeComplete', CodeComplete)
Vue.component('CopyFrom', CopyFrom)
Vue.component('CopyHash', CopyHash)

// 全局指令注册
import permission from '@/directive/permission'
Vue.use(permission)

// 全局变量注册
import global from '@/utils/global'
Vue.use(global)

// 全局方法注册
import checkPermission from '@/utils/permission'
Vue.prototype.checkPermission = checkPermission

import * as utils from '@/utils/utils'
Object.keys(utils).forEach(key => {
  Vue.prototype[key] = utils[key]
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
