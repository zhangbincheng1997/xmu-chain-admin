import request from '@/utils/request'

const API = '/service-auth/captcha'

export function getCaptcha() {
  return request({
    url: API,
    method: 'get'
  })
}
