import request from '@/utils/request';
import api from "./api"

export function getTypes() {
  return request(api.getTypes.api(), {
    method: api.getTypes.type
  })
}

export function getAllTypes() {
  return request(api.getAllTypes.api(), {
    method: api.getAllTypes.type
  })
}

export function getUnit() {
  return request(api.getUnit.api(), {
    method: api.getUnit.type
  })
}

export function getIndex() {
  return request(api.getIndex.api(), {
    method: api.getIndex.type
  })
}

export function getList(typeName) {
  return request(api.getList.api(typeName), {
    method: api.getList.type
  })
}

export function getSearch(typeName) {
  return request(api.getSearch.api(typeName), {
    method: api.getSearch.type
  })
}

export function getSubjectMatterAttribute(params) {
  return request(api.getSubjectMatterAttribute.api(params), {
    method: api.getSubjectMatterAttribute.type
  })
}

export function getPriceDatas(sid) {
  return request(api.getPriceDatas.api(sid), {
    method: api.getPriceDatas.type
  })
}

export function savePriceInfo(params) {
  return request(api.savePriceInfo.api(), {
    method: api.savePriceInfo.type,
    body: params
  })
}

export function getInfoByTast(tast) {
  return request(api.getInfoByTast.api(tast), {
    method: api.getInfoByTast.type
  })
}

export function saveAttributes(params) {
  return request(api.saveAttributes.api(), {
    method: api.saveAttributes.type,
    body: params
  })
}

export function getSpecificationList(params) {
  return request(api.getSpecificationList.api(params), {
    method: api.getSpecificationList.type
  })
}

export function saveSpecificationInfo(params) {
  return request(api.saveSpecificationInfo.api(), {
    method: api.saveSpecificationInfo.type,
    body: params
  })
}

export function getSourceAddressList(params) {
  return request(api.getSourceAddressList.api(params), {
    method: api.getSourceAddressList.type
  })
}

export function saveSourceAddressInfo(params) {
  return request(api.saveSourceAddressInfo.api(), {
    method: api.saveSourceAddressInfo.type,
    body: params
  })
}

export function deleteInfo(params) {
  return request(api.deleteInfo.api(), {
    method: api.deleteInfo.type,
    body: params
  })
}