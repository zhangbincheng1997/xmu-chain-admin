import request from '@/utils/request'

export function getPermissionList() {
  return request({
    url: '/permission/list',
    method: 'get'
  })
}

export function getPermissionTree() {
  return request({
    url: '/permission/tree',
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/permission',
    method: 'post',
    data: data
  })
}

export function editPermission(id, data) {
  return request({
    url: '/permission/' + id,
    method: 'put',
    data: data
  })
}

export function removePermission(id) {
  return request({
    url: '/permission/' + id,
    method: 'delete'
  })
}
