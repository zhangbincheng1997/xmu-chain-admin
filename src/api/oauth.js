import request from '@/utils/request'

const API = '/service-auth/oauth'

export function login(data) {
  data['grant_type'] = 'password'
  // data['grant_type'] = 'captcha'
  return request({
    url: API + '/token',
    method: 'post',
    params: data
  })
}

export function logout() {
  return request({
    url: API + '/logout',
    method: 'post'
  })
}
