import request from '@/utils/request'

const API = '/service-admin/api/v1/company'

export function getCompanyById(id) {
  return request({
    url: API + '/' + id,
    method: 'get'
  })
}

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function register(company, admin) {
  return request({
    url: API + '/register',
    method: 'post',
    data: {
      company: company,
      admin: admin
    }
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
