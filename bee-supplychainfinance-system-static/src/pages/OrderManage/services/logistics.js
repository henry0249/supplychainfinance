import request from '@/utils/request';
import apis  from '../apis/logistics'


export async function getLogisticsInfo(params) {
  return request(apis.getLogisticsInfo.api(params),{
    method: apis.getLogisticsInfo.type
  })
}

export async function delLogisticsAccessory(params) {
  return request(apis.delLogisticsAccessory.api(params), {
    method: apis.delLogisticsAccessory.type
  })
}

export async function getLogisticsLog(params) {
  return request(apis.getLogisticsLog.api(params.orderId), {
    method: apis.getLogisticsLog.type
  })
}

export async function saveLogisticsInfo(params) {
  return request(apis.saveLogisticsInfo.api(), {
    method: apis.saveLogisticsInfo.type,
    body: params
  })
}

export async function updateLogisticsInfo(params) {
  return request(apis.updateLogisticsInfo.api(), {
    method: apis.updateLogisticsInfo.type,
    body: params
  })
}