import request from '@/utils/request'

const API = '/service-admin/api/v1/permission'

function tree() {
  return request({
    url: API + '/tree',
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

export default {
  tree,
  add,
  edit,
  remove
}
