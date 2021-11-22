import request from '@/utils/request'

const API = '/service-admin/api/v1/role'

function list() {
  return request({
    url: API + '/list',
    method: 'get'
  })
}

function add(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: API + '/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: API + '/' + id,
    method: 'delete'
  })
}

function getMenu(id) {
  return request({
    url: API + '/menu/' + id,
    method: 'get'
  })
}

function setMenu(id, menuIds) {
  return request({
    url: API + '/menu/' + id,
    method: 'post',
    data: {
      ids: menuIds
    }
  })
}

function getPermission(id) {
  return request({
    url: API + '/permission/' + id,
    method: 'get'
  })
}

function setPermission(id, permissionIds) {
  return request({
    url: API + '/permission/' + id,
    method: 'post',
    data: {
      ids: permissionIds
    }
  })
}

export default {
  list,
  add,
  edit,
  remove,
  getMenu,
  setMenu,
  getPermission,
  setPermission
}
