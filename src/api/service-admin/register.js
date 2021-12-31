import request from '@/utils/request'

const API = '/service-admin/api/v1/register'

export function register(company, user) {
  return request({
    url: API,
    method: 'post',
    data: {
      company: company,
      user: user
    }
  })
}
