import request from '@/utils/request'

const API = '/service-trace/api/v1/stat'

export function stat(data) {
  return request({
    url: API,
    method: 'get',
    params: data
  })
}

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}
