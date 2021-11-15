import request from '@/utils/request'

function getQRCode(code) {
  return request({
    // url: '/tag/getQRCode',
    url: '/scan/getQRCodeBase64',
    method: 'get',
    params: {
      code: code
    }
  })
}

export default {
  getQRCode
}
