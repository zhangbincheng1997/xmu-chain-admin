import request from '@/utils/request'

export function getRoleList() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data: data
  })
}

export function editRole(id, data) {
  return request({
    url: '/role/' + id,
    method: 'put',
    data: data
  })
}

export function removeRole(id) {
  return request({
    url: '/role/' + id,
    method: 'delete'
  })
}
