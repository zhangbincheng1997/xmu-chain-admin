import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: '/admin/menu/tree',
    method: 'get'
  })
}

export function addMenu(data) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: data
  })
}

export function editMenu(id, data) {
  return request({
    url: '/admin/menu/' + id,
    method: 'put',
    data: data
  })
}

export function removeMenu(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}
