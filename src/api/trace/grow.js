import request from '@/utils/request'

function listByCode(code) {
  return request({
    url: '/trace/grow/list/' + code,
    method: 'get'
  })
}

function list(data) {
  return request({
    url: '/trace/grow/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/trace/grow',
    method: 'post',
    data: data
  })
}

export default {
  listByCode,
  list,
  add
}
