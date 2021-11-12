import request from '@/utils/request'

function getById(id) {
  return request({
    url: '/template/product/' + id,
    method: 'get'
  })
}

function all() {
  return request({
    url: '/template/product/all',
    method: 'get'
  })
}

function list(data) {
  return request({
    url: '/template/product/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/template/product',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/template/product/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/template/product/' + id,
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
