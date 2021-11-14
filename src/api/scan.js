import request from '@/utils/request'

function getQRCode(code) {
  return request({
    // url: '/scan/getQRCode',
    url: '/scan/getQRCodeBase64',
    method: 'get',
    params: {
      code: code
    }
  })
}

function listByCode(code) {
  return request({
    url: '/scan/list/' + code,
    method: 'get'
  })
}

function list(data) {
  return request({
    url: '/scan/list',
    method: 'get',
    params: data
  })
}

export default {
  getQRCode,
  listByCode,
  list
}
