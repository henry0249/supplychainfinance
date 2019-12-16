import request from '@/utils/request';
import apis from './apis'

export async function getEconomicData(params = {}) {
  return request(apis.getEconomicData.api(params), {
    method: apis.getEconomicData.type
  });
}

export async function updateMacroEconomicGrowth(params, key) {
  return request(apis.updateMacroEconomicGrowth.api(key), {
    method: apis.updateMacroEconomicGrowth.type,
    body: params
  });
}


export async function getEconomicChart(params) {
  return request(apis.getEconomicChart.api(params), {
    method: apis.getEconomicChart.type,
  });
}


