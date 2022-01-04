import request from '@/utils/request'

const API = '/service-trace/api/v1/template/product'

export function allTemplate() {
  return request({
    url: API + '/all',
    method: 'get'
  })
}

export function listTemplate(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function addTemplate(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

export function updateTemplate(id, data) {
  return request({
    url: API + '/' + id,
    method: 'put',
    data: data
  })
}

export function delTemplate(id) {
  return request({
    url: API + '/' + id,
    method: 'delete'
  })
}
