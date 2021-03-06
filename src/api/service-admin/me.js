import request from '@/utils/request'

const API = '/service-admin/api/v1/me'

export function getInfo() {
  return request({
    url: API + '/info',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: API + '/roles',
    method: 'get'
  })
}

export function updateInfo(data) {
  return request({
    url: API + '/info',
    method: 'put',
    data: data
  })
}

export function updatePassword(data) {
  return request({
    url: API + '/password',
    method: 'put',
    data: data
  })
}

export function getCompanyInfo() {
  return request({
    url: API + '/info/company',
    method: 'get'
  })
}

export function updateCompanyInfo(data) {
  return request({
    url: API + '/info/company',
    method: 'put',
    data: data
  })
}

export function getMenu() {
  return request({
    url: API + '/menu',
    method: 'get'
  })
}
