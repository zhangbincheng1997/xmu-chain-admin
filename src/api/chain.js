import request from '@/utils/request'

export function getNumberData(data) {
  return request({
    url: '/chain/group/general',
    method: 'get',
    params: data
  })
}

export function getChartData(data) {
  return request({
    url: '/chain/group/transDaily',
    method: 'get',
    params: data
  })
}

export function getNodeList(data) {
  return request({
    url: '/chain/node/nodeList',
    method: 'get',
    params: data
  })
}

export function getBlockList(data) {
  return request({
    url: '/chain/block/blockList',
    method: 'get',
    params: data
  })
}

export function getTransactionList(data) {
  return request({
    url: '/chain/transaction/transList',
    method: 'get',
    params: data
  })
}

export function getTransactionReceipt(transHash) {
  return request({
    url: '/chain/transaction/transactionReceipt',
    method: 'get',
    params: {
      transHash: transHash
    }
  })
}

export function decode(transHash) {
  return request({
    url: '/chain/decode',
    method: 'get',
    params: {
      transHash: transHash
    }
  })
}
