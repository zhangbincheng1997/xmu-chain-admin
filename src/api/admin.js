import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: data
  })
}

export function updateUser(id, data) {
  return request({
    url: '/admin/' + id,
    method: 'put',
    data: data
  })
}

export function updateUserRole(id, roleIds) {
  return request({
    url: '/admin/user/' + id,
    method: 'post',
    data: {
      roleIds: roleIds
    }
  })
}

export function removeUser(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}
