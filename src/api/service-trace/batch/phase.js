import request from '@/utils/request'

const API = '/service-trace/api/v1/batch/phase'

export function getPhaseByBatchId(batchId) {
  return request({
    url: API + '/' + batchId,
    method: 'get'
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

export function chain(id) {
  return request({
    url: API + '/chain' + id,
    method: 'post'
  })
}
