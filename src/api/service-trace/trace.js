import request from '@/utils/request'

const API = '/service-trace/api/v1/trace'

export function trace(batchId) {
  return request({
    url: API,
    method: 'get',
    params: {
      batchId: batchId
    }
  })
}
