import request from '@/utils/request'

const API = '/service-trace/api/v1/order'

export function listOrder(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function getOrderInfo(id) {
  return request({
    url: API + '/info/' + id,
    method: 'get'
  })
}

export function getOrderExpress(id) {
  return request({
    url: API + '/express/' + id,
    method: 'get'
  })
}

export function getOrderStatus(id) {
  return request({
    url: API + '/status/' + id,
    method: 'get'
  })
}

export function saveOrderInfo(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

export function updateOrderInfo(id, data) {
  return request({
    url: API + '/' + id,
    method: 'put',
    data: data
  })
}

export function saveOrUpdateOrderExpress(data) {
  return request({
    url: API + '/express',
    method: 'post',
    data: data
  })
}

export function take(id) {
  return request({
    url: API + '/take/' + id,
    method: 'post'
  })
}

export function send(id) {
  return request({
    url: API + '/send/' + id,
    method: 'post'
  })
}

export function receive(id) {
  return request({
    url: API + '/receive/' + id,
    method: 'post'
  })
}

export function close(id) {
  return request({
    url: API + '/close/' + id,
    method: 'post'
  })
}
