import request from '@/utils/request'

const API = '/service-trace/api/v1/tag/record'

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
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
