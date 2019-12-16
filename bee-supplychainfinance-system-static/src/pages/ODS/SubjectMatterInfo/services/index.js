import request from '@/utils/request';
import apis from './apis'

export async function getBigTypeInfo(params) {
  return request(apis.getBigTypeInfo.api(params), {
    method: apis.getBigTypeInfo.type,
  });
}

export async function getChartList(params) {
  return request(apis.getChartList.api(params), {
    method: apis.getChartList.type,
  });
}

export async function getChartInfo(params) {
  return request(apis.getChartInfo.api(params), {
    method: apis.getChartInfo.type,
  });
}


