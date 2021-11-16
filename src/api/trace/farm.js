import request from '@/utils/request'

function listByCode(code) {
  return request({
    url: '/trace/farm/list/' + code,
    method: 'get'
  })
}

function list(data) {
  return request({
    url: '/trace/farm/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/trace/farm',
    method: 'post',
    data: data
  })
}

export default {
  listByCode,
  list,
  add
}
