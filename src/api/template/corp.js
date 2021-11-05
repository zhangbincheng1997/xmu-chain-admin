import request from '@/utils/request'

function list(data) {
  return request({
    url: '/template/corp/list',
    method: 'get',
    params: data
  })
}

function add(data) {
  return request({
    url: '/template/corp',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: '/template/corp/' + id,
    method: 'put',
    data: data
  })
}

function remove(id) {
  return request({
    url: '/template/corp/' + id,
    method: 'delete'
  })
}

export default {
  list,
  add,
  edit,
  remove
}
