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

// 全局组件挂载
import Pagination from '@/components/Pagination'
import AvatarUpload from '@/components/Upload/Avatar'
import ImageUpload from '@/components/Upload/Image'
import CodeComplete from '@/components/CodeComplete'
Vue.component('Pagination', Pagination)
Vue.component('AvatarUpload', AvatarUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('CodeComplete', CodeComplete)

// 全局指令注册
import permission from '@/directive/permission'
Vue.use(permission)

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
