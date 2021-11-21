import request from '@/utils/request'

const API = '/service-trace/api/v1/qrcode'

function getQRCode(code) {
  return request({
    url: API + '/getBase64',
    method: 'get',
    params: {
      code: code
    }
  })
}

export default {
  getQRCode
}
