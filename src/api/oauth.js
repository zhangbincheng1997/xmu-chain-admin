import request from '@/utils/request'

const API = '/service-auth/oauth'

// Authorization: Basic base64(client_id:client_secret)
// client_id: xmu-chain-service-admin
// client_secret: 123456
export function token(data) {
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

export function gm(company_id) {
  return request({
    url: API + '/gm',
    method: 'post',
    params: {
      'companyId': company_id
    }
  })
}

export function change(role) {
  return request({
    url: API + '/change',
    method: 'post',
    params: {
      'role': role
    }
  })
}
