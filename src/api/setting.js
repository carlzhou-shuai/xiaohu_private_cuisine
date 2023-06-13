import request from '@/request/index'

export function apiAddMenu(params) {
  return request.post('/addMenu', {
    ...params
  })
}
