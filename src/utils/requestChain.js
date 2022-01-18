import axios from 'axios'
import { Message } from 'element-ui'

const URL = '/api/v1/app/token'
const APP_ID = 'TE6vAP56'
const APP_SECRET = '62nJqV01KLSKEbrUPBdnFEltPwVoIqCw'
const KEY = 'CHAIN_ACCESS_TOKEN'

function token() {
  const url = process.env.VUE_APP_CHAIN_API + URL
  const data = { appId: APP_ID, appSecret: APP_SECRET }
  return axios.post(url, data)
}

function set(key, data, exp) {
  const now = Date.now() / 1000
  const item = { data: data, exp: exp + now }
  localStorage.setItem(key, JSON.stringify(item))
}

function get(key) {
  const item = JSON.parse(localStorage.getItem(key))
  if (item) {
    const now = Date.now() / 1000
    if (now < item.exp) {
      return item.data
    } else {
      localStorage.removeItem(key)
    }
  }
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_CHAIN_API,
  timeout: 10 * 1000
})

// request interceptor
service.interceptors.request.use(
  async config => {
    let accessToken = get(KEY)
    if (!accessToken) {
      const response = await token()
      const res = response.data
      const { access_token, expires_in } = res.data
      set(KEY, access_token, expires_in)
      accessToken = access_token
    }
    config.headers['Authorization'] = accessToken
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

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
