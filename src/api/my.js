import request from '@/request/index'

export function apiGetOrder(params) {
  return request.post('/getOrder', {
    ...params
  })
}

export function apiSetFinish(params) {
  return request.post('/setFinish', {
    ...params
  })
}