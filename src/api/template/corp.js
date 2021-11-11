import request from '@/utils/request'

function getById(id) {
  return request({
    url: '/template/corp/' + id,
    method: 'get'
  })
}

function all() {
  return request({
    url: '/template/corp/all',
    method: 'get'
  })
}

function list(data) {
  return request({
    url: '/template/corp/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/template/corp',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/template/corp/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/template/corp/' + id,
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
