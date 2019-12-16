import request from '@/utils/request';
import apis from '../apis/settlement';

// 获取结算单信息
export async function getInfo(id) {
  return request(apis.getInfo.api(id));
}

// 获取结算单确认情况
export async function getsituation(url) {
  return request(apis.getsituation.api(url));
}

// 确认结算单
export async function confirm(params) {
  return request(apis.confirm.api(), {
    method: apis.confirm.type,
    body: params
  })
}

// 保存结算单
export async function save(params) {
  return request(apis.save.api(), {
    method: apis.save.type,
    body: params
  })
}

// 获取退回结算单
export async function getRefused(id) {
  return request(apis.getRefused.api(id))
}