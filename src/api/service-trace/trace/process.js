import request from '@/utils/request'

const API = '/service-trace/api/v1/trace/process'

function listByCode(code) {
  return request({
    url: API + '/list/' + code,
    method: 'get'
  })
}

function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

export default {
  listByCode,
  list,
  add
}
