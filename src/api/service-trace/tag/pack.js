import axios from 'axios'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

const API = '/service-trace/api/v1/tag/pack'

export function list(data) {
  return request({
    url: API + '/list',
    method: 'get',
    params: data
  })
}

export function status(ids, status) {
  return request({
    url: API + '/status',
    method: 'post',
    data: {
      ids: ids,
      status: status
    }
  })
}

export function generate(batchId, count) {
  return request({
    url: API + '/generate',
    method: 'post',
    data: {
      batchId: batchId,
      count: count
    }
  })
}

export function downloadText(id) {
  return axios({
    url: process.env.VUE_APP_BASE_API + API + '/download/text/' + id,
    method: 'get',
    responseType: 'blob',
    headers: {
      Authorization: getToken()
    }
  })
}

export function downloadImage(id) {
  return axios({
    url: process.env.VUE_APP_BASE_API + API + '/download/image/' + id,
    method: 'get',
    responseType: 'blob',
    headers: {
      Authorization: getToken()
    }
  })
}
