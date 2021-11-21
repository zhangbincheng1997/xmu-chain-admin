import request from '@/utils/request'

const API = '/service-trace/api/v1/order'

function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

function getOrderInfo(id) {
  return request({
    url: API + '/info/' + id,
    method: 'get'
  })
}

function getOrderExpress(id) {
  return request({
    url: API + '/express/' + id,
    method: 'get'
  })
}

function getOrderStatus(id) {
  return request({
    url: API + '/status/' + id,
    method: 'get'
  })
}

function saveOrder(data) {
  return request({
    url: API,
    method: 'post',
    data: data
  })
}

function updateOrder(id, data) {
  return request({
    url: API + '/' + id,
    method: 'put',
    data: data
  })
}

function saveOrUpdateOrderExpress(data) {
  return request({
    url: API + '/express',
    method: 'post',
    data: data
  })
}

function take(id) {
  return request({
    url: API + '/take/' + id,
    method: 'post'
  })
}

function send(id) {
  return request({
    url: API + '/send/' + id,
    method: 'post'
  })
}

function receive(id) {
  return request({
    url: API + '/receive/' + id,
    method: 'post'
  })
}

function close(id) {
  return request({
    url: API + '/close/' + id,
    method: 'post'
  })
}

export default {
  list,
  getOrderInfo,
  getOrderExpress,
  getOrderStatus,
  saveOrder,
  updateOrder,
  saveOrUpdateOrderExpress,
  take,
  send,
  receive,
  close
}
