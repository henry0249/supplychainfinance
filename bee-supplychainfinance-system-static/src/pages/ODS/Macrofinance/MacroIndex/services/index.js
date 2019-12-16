import request from '@/utils/request';
import apis from './apis'

export async function getMacroResult(params = {}) {
  return request(apis.getMacroResult.api(params), {
    method: apis.getMacroResult.type
  });
}

export async function getResultByDateType(params = {}) {
  return request(apis.getResultByDateType.api(params), {
    method: apis.getResultByDateType.type
  });
}

export async function getResultByBeginEnd(params, key) {
  return request(apis.getResultByBeginEnd.api(key), {
    method: apis.getResultByBeginEnd.type,
    body: params
  });
}

export async function getBeginEndDate(params = {}) {
  return request(apis.getBeginEndDate.api(params), {
    method: apis.getBeginEndDate.type
  });
}
export async function getDateTypes(params = {}) {
  return request(apis.getDateTypes.api(params), {
    method: apis.getDateTypes.type
  });
}
