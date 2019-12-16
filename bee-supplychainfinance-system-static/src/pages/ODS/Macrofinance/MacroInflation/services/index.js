import request from '@/utils/request';
import apis from './apis'

export async function getMacroInflationList(params = {}) {
  return request(apis.getMacroInflationList.api(params), {
    method: apis.getMacroInflationList.type
  });
}

export async function updateMacroInflation(params, key) {
  return request(apis.updateMacroInflation.api(key), {
    method: apis.updateMacroInflation.type,
    body: params
  });
}

export async function getMacroInflationChart(params) {
  return request(apis.getMacroInflationChart.api(params), {
    method: apis.getMacroInflationChart.type,
  });
}
