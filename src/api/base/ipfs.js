import request from '@/utils/request'

const API = '/service-admin/api/v1/ipfs'

export function upload(file) {
  return request({
    url: API + '/upload',
    method: 'post',
    data: file
  })
}
