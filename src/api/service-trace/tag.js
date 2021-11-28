import request from '@/utils/request'

const API = '/service-trace/api/v1/tag'

export function check(code, securityCode) {
  return request({
    url: API + '/check',
    method: 'post',
    data: {
      code: code,
      securityCode: securityCode
    }
  })
}

export function generate(code, count) {
  return request({
    url: API + '/generate',
    method: 'post',
    data: {
      code: code,
      count: count
    }
  })
}

export function status(ids, status) {
  return request({
    url: API + '/status',
    method: 'post',
    data: {
      ids: ids,
      status: status
    }
  })
}

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function listSearch(data) {
  return request({
    url: API + '/search/list',
    method: 'get',
    params: data
  })
}
