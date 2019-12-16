import { stringify } from 'qs'
import request from '@/utils/request'
import apis from '../apis'
import { queryString } from '@/utils/utils'

export async function getFlowChart(applyId) {
  return request(apis.getFlowChart.api(applyId), { method: 'GET' })
}

export async function getProcessScheduleDetail(applyId) {
  return request(apis.getProcessScheduleDetail.api(applyId), { method: 'GET' })
}
export async function getCount(id) {
  return request(apis.getCount.api(id), {
    method: apis.getCount.type
  })
}
export async function getList(params) {
  return request(apis.getList.api(params.url), {
    method: apis.getList.type,
    body: params.params
  })
}

export async function getBuyDetail(params) {
  return request(apis.entrustBuyDetailBuy.api(params), {
    method: apis.entrustBuyDetailBuy.type
  })
}
export async function getLargeBuyDetail(params) {
  return request(apis.largeEntrustBuyDetail.api(params), {
    method: apis.largeEntrustBuyDetail.type
  })
}
export async function getSaleDetail(params) {
  return request(apis.entrustSaleDetailSale.api(params), {
    method: apis.entrustSaleDetailSale.type
  })
}
export async function getStorageDetail(params) {
  return request(apis.financeStorageDetail.api(params), {
    method: apis.financeStorageDetail.type
  })
}
