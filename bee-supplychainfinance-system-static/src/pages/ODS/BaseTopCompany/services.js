import request from '@/utils/request';
import api from "./api";

export function getConstant() {
  return request(api.getConstant.api(), {
    method: api.getConstant.type
  })
}

export function getYears() {
  return request(api.getYears.api(), {
    method: api.getYears.type
  })
}

export function getListByCondition(params) {
  return request(api.getListByCondition.api(params), {
    method: api.getListByCondition.type
  })
}

export function getDataByName(params) {
  return request(api.getDataByName.api(params), {
    method: api.getDataByName.type
  })
}

export function deleteData(params) {
  return request(api.deleteData.api(), {
    method: api.deleteData.type,
    body: params
  })
}

export function getDataById(id) {
  return request(api.getDataById.api(id), {
    method: api.getDataById.type
  })
}

export function saveData(params) {
  return request(api.saveData.api(), {
    method: api.saveData.type,
    body: params
  })
}