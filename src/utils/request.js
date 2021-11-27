import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5 * 1000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 请求正在刷新
let refreshing = false
// 请求等待队列
let waitQueue = []

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // token过期
      if (res.code === 1002) {
        const config = response.config
        if (!refreshing) {
          // token续期
          refreshing = true
          return store.dispatch('user/refreshToken', getRefreshToken()).then((token) => {
            // token续期成功
            config.headers['Authorization'] = token
            config.baseURL = '' // url已包含baseURL
            waitQueue.forEach(callback => callback(token)) // 重试请求
            waitQueue = []
            return service(config)
          }).catch(() => {
            // token续期失败
            MessageBox.confirm(
              '当前页面已失效，请重新登录', '确认退出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            })
          }).finally(() => {
            refreshing = false
          })
        } else {
          // 加入请求等待队列
          return new Promise(resolve => {
            waitQueue.push((token) => {
              config.headers['Authorization'] = token
              config.baseURL = ''
              resolve(service(config))
            })
          })
        }
      }

      // Token不允许使用！
      if (res.code === 1010) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // for debug
      Message({
        message: res,
        type: 'success',
        duration: 2 * 1000
      })
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
