import request from '@/utils/request'

const API = '/service-trace/api/v1/batch/phase'

export function getPhaseByBatchId(batchId) {
  return request({
    url: API + '/' + batchId,
    method: 'get'
  })
}

export function addPhase(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

export function updatePhase(id, data) {
  return request({
    url: API + '/' + id,
    method: 'put',
    data: data
  })
}

export function delPhase(id) {
  return request({
    url: API + '/' + id,
    method: 'delete'
  })
}

export function chain(id) {
  return request({
    url: API + '/chain/' + id,
    method: 'post'
  })
}
