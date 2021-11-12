import request from '@/utils/request'

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
  listByCode,
  list
}
