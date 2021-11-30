import request from '@/utils/request'

const API = '/service-admin/api/v1/user'

export function register(data) {
  return request({
    url: API + '/register',
    method: 'post',
    data: data
  })
}

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: API + '/info/' + id,
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: API + '/' + id,
    method: 'delete'
  })
}

export function updatePassword(id, password) {
  return request({
    url: API + '/password/' + id,
    method: 'put',
    data: {
      'password': password
    }
  })
}

export function getRole(id) {
  return request({
    url: API + '/role/' + id,
    method: 'get'
  })
}

export function setRole(id, roleIds) {
  return request({
    url: API + '/role/' + id,
    method: 'post',
    data: {
      ids: roleIds
    }
  })
}

export function enabled(id, enabled) {
  return request({
    url: API + '/enabled/' + id,
    method: 'post',
    data: {
      enabled: enabled
    }
  })
}
