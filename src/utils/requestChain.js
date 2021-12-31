import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_CHAIN_API,
  timeout: 10 * 1000
})

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

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // Message({
      //   message: res,
      //   type: 'success',
      //   duration: 2 * 1000
      // })
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
