import request from '@/utils/request'

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
  list,
  add,
  edit,
  remove
}
