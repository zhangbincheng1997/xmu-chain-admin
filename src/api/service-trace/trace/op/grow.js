import request from '@/utils/request'

const API = '/service-trace/api/v1/trace/op/grow'

export function listGrowByCode(code) {
  return request({
    url: API + '/list/' + code,
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
