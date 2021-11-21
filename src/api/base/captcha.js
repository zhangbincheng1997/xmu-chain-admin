import request from '@/utils/request'

const API = '/service-admin/api/v1/captcha'

export function getCaptcha() {
  return request({
    url: API,
    method: 'get'
  })
}
