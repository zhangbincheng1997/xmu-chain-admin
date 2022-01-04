import request from '@/utils/request'

const API = '/service-trace/api/v1/tag/pack'

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function getPackCode(id) {
  return request({
    url: API + '/' + id,
    method: 'get'
  })
}

export function generate(batchNo, count) {
  return request({
    url: API + '/generate',
    method: 'post',
    data: {
      batchNo: batchNo,
      count: count
    }
  })
}
