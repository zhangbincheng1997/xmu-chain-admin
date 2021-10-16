import request from '@/utils/request'

export function getMenuList() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data: data
  })
}

export function editMenu(id, data) {
  return request({
    url: '/menu/' + id,
    method: 'put',
    data: data
  })
}

export function removeMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}

export function getRoleMenu(id) {
  return request({
    url: '/menu/role/' + id,
    method: 'get'
  })
}

export function setRoleMenu(id, menuIds) {
  return request({
    url: '/menu/role/' + id,
    method: 'post',
    data: {
      menuIds: menuIds
    }
  })
}
