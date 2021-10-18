import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data: data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function updateInfo(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data: data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/password',
    method: 'put',
    data: data
  })
}

export function getMenu() {
  return request({
    url: '/user/menu',
    method: 'get'
  })
}
