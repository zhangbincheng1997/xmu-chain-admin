import request from '@/utils/request'

function check(code, securityCode) {
  return request({
    url: '/tag/check',
    method: 'post',
    data: {
      code: code,
      securityCode: securityCode
    }
  })
}

function generate(code, count) {
  return request({
    url: '/tag/generate',
    method: 'post',
    data: {
      code: code,
      count: count
    }
  })
}

function status(ids, status) {
  return request({
    url: '/tag/status',
    method: 'post',
    data: {
      ids: ids,
      status: status
    }
  })
}

function list(data) {
  return request({
    url: '/tag/list',
    method: 'get',
    params: data
  })
}

function listSearch(data) {
  return request({
    url: '/tag/search/list',
    method: 'get',
    params: data
  })
}

export default {
  check,
  generate,
  status,
  list,
  listSearch
}
