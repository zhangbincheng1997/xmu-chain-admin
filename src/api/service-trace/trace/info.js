import request from '@/utils/request'

const API = '/service-trace/api/v1/trace/info'

export function getInfoByCode(code) {
  return request({
    url: API + '/' + code,
    method: 'get'
  })
}

export function allTrace() {
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

export function update(code, data) {
  return request({
    url: API + '/' + code,
    method: 'put',
    data: data
  })
}

export function del(code) {
  return request({
    url: API + '/' + code,
    method: 'delete'
  })
}
