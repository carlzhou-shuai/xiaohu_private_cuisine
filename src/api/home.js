import request from '@/request/index'

export function apiGetMenu(params) {
  return request.get('/getMenu', {
    ...params
  })
}

export function apiAddCart(params) {
  return request.post('/addCart', {
    ...params
  })
}