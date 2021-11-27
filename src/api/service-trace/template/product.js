import request from '@/utils/request'

const API = '/service-trace/api/v1/template/product'

export function getProductById(id) {
  return request({
    url: API + '/' + id,
    method: 'get'
  })
}

export function allProduct() {
  return request({
    url: API + '/all',
    method: 'get'
  })
}

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: API + '/' + id,
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: API + '/' + id,
    method: 'delete'
  })
}
