import request from '@/utils/request'

function list(data) {
  return request({
    url: '/admin/company/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/admin/company',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/admin/company/info/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/admin/company' + id,
    method: 'delete'
  })
}

function updatePassword(id, data) {
  return request({
    url: '/admin/company/password/' + id,
    method: 'put',
    data: data
  })
}

export default {
  list,
  add,
  edit,
  remove,
  updatePassword
}
