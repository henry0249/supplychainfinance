import request from '@/utils/request';
import api from "./api";

export function getAllProvince() {
  return request(api.getAllProvince.api(), {
    method: api.getAllProvince.type
  })
}

export function getDataByProvince(params) {
  return request(api.getDataByProvince.api(params), {
    method: api.getDataByProvince.type
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