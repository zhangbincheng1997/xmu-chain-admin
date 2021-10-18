import request from '@/utils/request'

export function getRoleList() {
  return request({
    url: '/admin/role/list',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/admin/role',
    method: 'post',
    data: data
  })
}

export function editRole(id, data) {
  return request({
    url: '/admin/role/' + id,
    method: 'put',
    data: data
  })
}

export function removeRole(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}

export function getRoleMenu(id) {
  return request({
    url: '/admin/role/menu/' + id,
    method: 'get'
  })
}

export function setRoleMenu(id, menuIds) {
  return request({
    url: '/admin/role/menu/' + id,
    method: 'post',
    data: {
      menuIds: menuIds
    }
  })
}

export function getRolePermission(id) {
  return request({
    url: '/admin/role/permission/' + id,
    method: 'get'
  })
}

export function setRolePermission(id, permissionIds) {
  return request({
    url: '/admin/role/permission/' + id,
    method: 'post',
    data: {
      permissionIds: permissionIds
    }
  })
}
