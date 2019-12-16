import request from '@/utils/request'
import apis from '../apis'

export async function saveDataFirst(params) {
  return request(apis.saveDetailFirst.api(), {
    method: apis.saveDetailFirst.type,
    body: params
  })
}
export async function saveDataSecond(params) {
  return request(apis.saveDetailSecond.api(), {
    method: apis.saveDetailSecond.type,
    body: params
  })
}
export async function saveDataThird(params) {
  return request(apis.saveDetailThird.api(), {
    method: apis.saveDetailThird.type,
    body: params
  })
}
export async function saveDataFourth(params) {
  return request(apis.saveDetailFourth.api(), {
    method: apis.saveDetailFourth.type,
    body: params
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
export async function getSelectData(params) {
  return request(apis.getSysCodeInfo.api(params), {
    method: apis.getSysCodeInfo.type
  })
}
export async function getSubjectMatterInfo(params) {
  return request(apis.getSubjectMatterInfo.api(params), {
    method: apis.getSubjectMatterInfo.type
  })
}
export async function getSubjectMatterList(params) {
  return request(apis.getSubjectMatterList.api(params), {
    method: apis.getSubjectMatterList.type
  })
}

export async function getSubjectMatterPriceUnitList(params) {
  return request(apis.getSubjectMatterPriceUnitList.api(params), {
    method: apis.getSubjectMatterPriceUnitList.type
  })
}
//委托销售验证货代公司新接口
export async function checkForwardingCompany(params) {
  let str = ''
  str = `applyId=${params.applyId}&companyName=${params.companyName}&tast=${
    params.tast
  }`
  if (params.companyBaseId) {
    str += `&companyBaseId=${params.companyBaseId}`
  }
  return request(apis.checkForwardingCompany.api(str), {
    method: apis.checkForwardingCompany.type
  })
}
export async function getFullDetails(params) {
  return request(apis.getFullDetailsByName.api(params), {
    method: apis.getFullDetailsByName.type
  })
}
