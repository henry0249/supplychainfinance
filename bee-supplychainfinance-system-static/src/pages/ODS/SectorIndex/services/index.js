import request from '@/utils/request';
import apis from './apis'

export async function getList(params = {}) {
  return request(apis.getList.api(params), {
    method: apis.getList.type
  });
}

export async function uploadList(params, key) {
  return request(apis.uploadList.api(key), {
    method: apis.uploadList.type,
    body: params
  });
}

export async function getUnits(params = {}) {
  return request(apis.getUnits.api(params), {
    method: apis.getUnits.type
  });
}

export async function getEditList(params = {}) {
  return request(apis.getEditList.api(params), {
    method: apis.getEditList.type
  });
}

export async function updateEditList(params) {
  return request(apis.updateEditList.api(), {
    method: apis.updateEditList.type,
    body: params
  });
}

export async function getChart(params) {
  return request(apis.getChart.api(params), {
    method: apis.getChart.type,
  });
}

export async function getTree(params) {
  return request(apis.getTree.api(params), {
    method: apis.getTree.type,
  });
}
