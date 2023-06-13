import request from '@/request/index'

export function apiGetCart(params) {
  return request.get('/getCart', {
    ...params
  })
}

export function apiUpdateCart(params) {
  return request.post('/updateCart', {
    ...params
  })
}

export function apiDeleteCart(params) {
  return request.post('/deleteCart', {
    ...params
  })
}

export function apiStartOrder(params) {
  return request.post('/startOrder', {
    ...params
  })
}
