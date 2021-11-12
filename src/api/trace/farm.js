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

function edit(id, data) {
  return request({
    url: '/trace/farm/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/trace/farm/' + id,
    method: 'delete'
  })
}

export default {
  listByCode,
  list,
  add,
  edit,
  remove
}
