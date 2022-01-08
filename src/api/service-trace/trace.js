import request from '@/utils/request'

const API = '/service-trace/api/v1/trace'

export function trace(batchNo, code) {
  return request({
    url: API,
    method: 'get',
    params: {
      batchNo: batchNo,
      code: code
    }
  })
}
