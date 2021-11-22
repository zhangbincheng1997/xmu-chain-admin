import request from '@/utils/request'

const API = '/service-trace/api/v1/template/product'

function getById(id) {
  return request({
    url: API + '/' + id,
    method: 'get'
  })
}

function all() {
  return request({
    url: API + '/all',
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
    url: API + '/' + id,
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
  all,
  list,
  add,
  edit,
  remove
}
