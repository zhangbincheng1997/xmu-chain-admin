import request from '@/utils/request'

const API = '/service-admin/api/v1/company'

function getById(id) {
  return request({
    url: API + '/' + id,
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

export default {
  getById,
  list,
  add,
  edit,
  remove
}
