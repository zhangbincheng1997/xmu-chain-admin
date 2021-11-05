import request from '@/utils/request'

function tree() {
  return request({
    url: '/admin/menu/tree',
    method: 'get'
  })
}

function add(data) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/admin/menu/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export default {
  tree,
  add,
  edit,
  remove
}
