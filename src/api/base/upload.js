import request from '@/utils/request'

const API = '/service-admin/api/v1/upload'

export function upload(file) {
  return request({
    url: API,
    method: 'post',
    data: file
  })
}
