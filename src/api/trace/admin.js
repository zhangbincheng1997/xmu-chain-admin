import request from '@/utils/request'

function list(data) {
  return request({
    url: '/trace/admin/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/trace/admin',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/trace/admin/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/trace/admin/' + id,
    method: 'delete'
  })
}

export default {
  list,
  add,
  edit,
  remove
}
