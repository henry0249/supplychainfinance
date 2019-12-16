import request from '@/utils/request';
import api from "./api"

export function getBaseGrossProfitRate(params) {
  return request(api.getBaseGrossProfitRate.api(params), {
    method: api.getBaseGrossProfitRate.type
  })
}

export function deleteBaseGrossProfitRate(params) {
  return request(api.deleteBaseGrossProfitRate.api(), {
    method: api.deleteBaseGrossProfitRate.type,
    body: params
  })
}

export function getList() {
  return request(api.getList.api(), {
    method: api.getList.type,
  })
}

export function saveBaseGrossProfitRate(params) {
  return request(api.saveBaseGrossProfitRate.api(), {
    method: api.saveBaseGrossProfitRate.type,
    body: params
  })
}

export function queryBySourceName(name) {
  return request(api.queryBySourceName.api(name), {
    method: api.queryBySourceName.type,
  })
}