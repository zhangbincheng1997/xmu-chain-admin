import request from '@/utils/request'

const API = '/service-admin/api/v1/route'

export function getRouteList() {
  return request({
    url: API,
    method: 'get'
  })
}
