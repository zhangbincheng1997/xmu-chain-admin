import request from '@/utils/request'

const API = '/service-trace/api/v1/scan'

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function stat(data) {
  return request({
    url: API + '/stat',
    method: 'get',
    params: data
  })
}
