import request from '@/utils/request'

function getById(id) {
  return request({
    url: '/template/plot/' + id,
    method: 'get'
  })
}

function all() {
  return request({
    url: '/template/plot/all',
    method: 'get'
  })
}

function list(data) {
  return request({
    url: '/template/plot/list',
    method: 'get',
    params: data
  })
}

function listByPlaceId(id) {
  return request({
    url: '/template/plot/placeId/' + id,
    method: 'get'
  })
}

function add(data) {
  return request({
    url: '/template/plot',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/template/plot/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/template/plot/' + id,
    method: 'delete'
  })
}

export default {
  getById,
  all,
  list,
  listByPlaceId,
  add,
  edit,
  remove
}
