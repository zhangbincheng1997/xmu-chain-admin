import request from '@/utils/request'

const API = '/service-admin/api/v1/role'

export function listRole() {
  return request({
    url: API + '/list',
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

export function getMenu(id) {
  return request({
    url: API + '/menu/' + id,
    method: 'get'
  })
}

export function setMenu(id, menuIds) {
  return request({
    url: API + '/menu/' + id,
    method: 'post',
    data: {
      ids: menuIds
    }
  })
}

export function getPermission(id) {
  return request({
    url: API + '/permission/' + id,
    method: 'get'
  })
}

export function setPermission(id, permissionIds) {
  return request({
    url: API + '/permission/' + id,
    method: 'post',
    data: {
      ids: permissionIds
    }
  })
}
