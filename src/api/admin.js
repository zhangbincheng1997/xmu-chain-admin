import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/admin',
    method: 'post',
    data: data
  })
}

export function editUser(id, data) {
  return request({
    url: '/admin/' + id,
    method: 'put',
    data: data
  })
}

export function removeUser(id) {
  return request({
    url: '/admin/' + id,
    method: 'delete'
  })
}

export function getUserRole(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function setUserRole(id, roleIds) {
  return request({
    url: '/admin/role/' + id,
    method: 'post',
    data: {
      roleIds: roleIds
    }
  })
}
