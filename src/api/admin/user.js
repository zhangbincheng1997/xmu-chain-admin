import request from '@/utils/request'

function list(data) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/admin/user/info' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

function updatePassword(id, data) {
  return request({
    url: '/admin/user/password/' + id,
    method: 'put',
    data: data
  })
}

function getRole(id) {
  return request({
    url: '/admin/user/role/' + id,
    method: 'get'
  })
}

function setRole(id, roleIds) {
  return request({
    url: '/admin/user/role/' + id,
    method: 'post',
    data: {
      ids: roleIds
    }
  })
}

export default {
  list,
  add,
  edit,
  remove,
  updatePassword,
  getRole,
  setRole
}
