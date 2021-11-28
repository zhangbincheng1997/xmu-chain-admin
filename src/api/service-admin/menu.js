import request from '@/utils/request'

const API = '/service-admin/api/v1/menu'

export function getMenuRouteList() {
  return request({
    url: API + '/route',
    method: 'get'
  })
}

export function treeMenu() {
  return request({
    url: API + '/tree',
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
