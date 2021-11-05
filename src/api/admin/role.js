import request from '@/utils/request'

function list() {
  return request({
    url: '/admin/role/list',
    method: 'get'
  })
}

function add(data) {
  return request({
    url: '/admin/role',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/admin/role/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}

function getMenu(id) {
  return request({
    url: '/admin/role/menu/' + id,
    method: 'get'
  })
}

function setMenu(id, menuIds) {
  return request({
    url: '/admin/role/menu/' + id,
    method: 'post',
    data: {
      ids: menuIds
    }
  })
}

function getPermission(id) {
  return request({
    url: '/admin/role/permission/' + id,
    method: 'get'
  })
}

function setPermission(id, permissionIds) {
  return request({
    url: '/admin/role/permission/' + id,
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
