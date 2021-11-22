import request from '@/utils/request'

const API = '/service-auth/oauth'

// Authorization: Basic base64(client_id:client_secret)
// client_id: xmu-chain-service-admin
// client_secret: 123456
export function login(data) {
  return request({
    url: API + '/token',
    method: 'post',
    params: data,
    headers: {
      'Authorization': 'Basic eG11LWNoYWluLWFkbWluOjEyMzQ1Ng=='
    }
  })
}

export function logout() {
  return request({
    url: API + '/logout',
    method: 'post'
  })
}