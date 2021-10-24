import request from '@/utils/request'
// import { reviseParam } from './util'

export function getNumberData(data) {
  return request({
    url: '/monitor/group/general',
    // url: '/monitor/group/general/${data}`,
    method: 'get'
  })
}

export function getChartData(data) {
  return request({
    url: '/monitor/group/transDaily',
    method: 'get'
  })
}

export function getNodeList(data) {
  return request({
    url: '/monitor/node/nodeList',
    method: 'get'
  })
}

export function getBlockList(data) {
  return request({
    url: '/monitor/block/blockList',
    method: 'get'
  })
}

export function getTransactionList(data) {
  return request({
    url: '/monitor/transaction/transList',
    method: 'get'
  })
}
