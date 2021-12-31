import request from '@/utils/requestChain'

const API = '/api/v1/browser'

export function getNumberData(data) {
  return request({
    url: API + '/group/general',
    method: 'get',
    params: data
  })
}

export function getChartData(data) {
  return request({
    url: API + '/group/transDaily',
    method: 'get',
    params: data
  })
}

export function getNodeList(data) {
  return request({
    url: API + '/node/nodeList',
    method: 'get',
    params: data
  })
}

export function getBlockList(data) {
  return request({
    url: API + '/block/blockList',
    method: 'get',
    params: data
  })
}

export function getTransactionList(data) {
  return request({
    url: API + '/transaction/transList',
    method: 'get',
    params: data
  })
}

export function getTransactionReceipt(transHash) {
  return request({
    url: API + '/transaction/transactionReceipt',
    method: 'get',
    params: {
      transHash: transHash
    }
  })
}

export function decode(transHash) {
  return request({
    url: API + '/decode',
    method: 'get',
    params: {
      transHash: transHash
    }
  })
}
