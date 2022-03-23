import request from '@/utils/request'

const API = '/service-evidence/api/v1/ipfs'

export function upload(file) {
  return request({
    url: API,
    method: 'post',
    data: file
  })
}
