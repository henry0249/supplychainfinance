import request from '@/utils/request';
import apis from './apis'

export async function getTagTypes(params = {}) {
  return request(apis.getTagTypes.api(), {
    method: apis.getTagTypes.type
  });
}

export async function getTabs(params) {
  return request(apis.getTabs.api(params), {
    method: apis.getTabs.type
  });
}
