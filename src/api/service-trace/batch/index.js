import request from '@/utils/request'

const API = '/service-trace/api/v1/batch'

export function getBatchById(id) {
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

export function add(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

export function del(id) {
  return request({
    url: API + '/' + id,
    method: 'delete'
  })
}

export function updateSources(id, data) {
  return request({
    url: API + '/sources/' + id,
    method: 'post',
    data: data
  })
}

export function updateShop(id, data) {
  return request({
    url: API + '/shop/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(ids, status) {
  return request({
    url: API + '/status',
    method: 'post',
    data: {
      ids: ids,
      status: status
    }
  })
}
