import request from '@/utils/request'

const API = '/service-admin/api/v1/company'

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

function edit(id, data) {
  return request({
    url: API + '/info/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: API + '/' + id,
    method: 'delete'
  })
}

function updatePassword(id, data) {
  return request({
    url: API + '/' + id,
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
