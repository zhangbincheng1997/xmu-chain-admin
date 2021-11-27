import request from '@/utils/request'

const API = '/service-trace/api/v1/qrcode'

export function getQRCode(code) {
  return request({
    url: API + '/getBase64',
    method: 'get',
    params: {
      code: code
    }
  })
}
