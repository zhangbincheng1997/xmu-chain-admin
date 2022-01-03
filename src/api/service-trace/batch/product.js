import request from '@/utils/request'

const API = '/service-trace/api/v1/batch/product'

export function getProductByBatchId(batchId) {
  return request({
    url: API + '/' + batchId,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: API + '/' + id,
    method: 'put',
    data: data
  })
}

export function chain(id) {
  return request({
    url: API + '/chain/' + id,
    method: 'post'
  })
}
