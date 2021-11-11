import request from '@/utils/request'

function getByCode(code) {
  return request({
    url: '/trace/admin/' + code,
    method: 'get'
  })
}

function list(data) {
  return request({
    url: '/trace/admin/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/trace/admin',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/trace/admin/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/trace/admin/' + id,
    method: 'delete'
  })
}

export default {
  getByCode,
  list,
  add,
  edit,
  remove
}
