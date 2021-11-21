import request from '@/utils/request'

const API = '/service-trace/api/v1/trace/admin'

function getByCode(code) {
  return request({
    url: API + '/' + code,
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

function edit(code, data) {
  return request({
    url: API + '/' + code,
    method: 'put',
    data: data
  })
}

function remove(code) {
  return request({
    url: API + '/' + code,
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
