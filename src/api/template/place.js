import request from '@/utils/request'

function getById(id) {
  return request({
    url: '/template/place/' + id,
    method: 'get'
  })
}

function all() {
  return request({
    url: '/template/place/all',
    method: 'get'
  })
}

function list(data) {
  return request({
    url: '/template/place/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/template/place',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/template/place/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/template/place/' + id,
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
