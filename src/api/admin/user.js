import request from '@/utils/request'

const API = '/service-admin/api/v1/user'

function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

function saveCompanyAdmin(data) {
  return request({
    url: API + '/create/admin',
    method: 'post',
    data: data
  })
}

function saveCompanyMember(data) {
  return request({
    url: API + '/create/member',
    method: 'post',
    data: data
  })
}

function edit(id, data) {
  return request({
    url: API + '/info/' + id,
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

function updatePassword(id, data) {
  return request({
    url: API + '/password/' + id,
    method: 'put',
    data: data
  })
}

function getRole(id) {
  return request({
    url: API + '/role/' + id,
    method: 'get'
  })
}

function setRole(id, roleIds) {
  return request({
    url: API + '/role/' + id,
    method: 'post',
    data: {
      ids: roleIds
    }
  })
}

export default {
  list,
  saveCompanyAdmin,
  saveCompanyMember,
  edit,
  remove,
  updatePassword,
  getRole,
  setRole
}
