import request from '@/utils/request'

export function getPermissionTree() {
  return request({
    url: '/admin/permission/tree',
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/admin/permission',
    method: 'post',
    data: data
  })
}

export function editPermission(id, data) {
  return request({
    url: '/admin/permission/' + id,
    method: 'put',
    data: data
  })
}

export function removePermission(id) {
  return request({
    url: '/admin/permission/' + id,
    method: 'delete'
  })
}
