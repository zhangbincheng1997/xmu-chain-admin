import request from '@/utils/request'

function list(data) {
  return request({
    url: '/order/list',
    method: 'get',
    params: data
  })
}

function getOrderInfo(id) {
  return request({
    // url: '/order/info/' + id,
    url: '/order/info/' + id,
    method: 'get'
  })
}

function getOrderExpress(id) {
  return request({
    url: '/order/express/' + id,
    method: 'get'
  })
}

function getOrderStatus(id) {
  return request({
    url: '/order/status/' + id,
    method: 'get'
  })
}

function saveOrder(data) {
  return request({
    url: '/order',
    method: 'post',
    data: data
  })
}

function updateOrder(id, data) {
  return request({
    url: '/order/' + id,
    method: 'put',
    data: data
  })
}

function saveOrUpdateOrderExpress(data) {
  return request({
    url: '/order/express',
    method: 'post',
    data: data
  })
}

function take(id) {
  return request({
    url: '/order/take/' + id,
    method: 'post'
  })
}

function send(id) {
  return request({
    url: '/order/send/' + id,
    method: 'post'
  })
}

function receive(id) {
  return request({
    url: '/order/receive/' + id,
    method: 'post'
  })
}

function close(id) {
  return request({
    url: '/order/close/' + id,
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
