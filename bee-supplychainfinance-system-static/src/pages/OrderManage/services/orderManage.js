import request from '@/utils/request'
import apis  from '../apis/orderManage'

export async function getCounts(id) {
  return request(apis.getCounts.api(id));
}

export async function getList(params) {
  return request(apis.getList.api(params.url), {
    method: apis.getList.type,
    body: params.params
  });
}

export async function submitBack(params) {
  return request(apis.submitBack.api(), {
    method: apis.submitBack.type,
    body: params
  });
}
