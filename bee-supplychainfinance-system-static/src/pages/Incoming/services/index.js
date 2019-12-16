import request from "@/utils/request";
import api from '../apis';

export async function getApplyCount (id) {
  return request(api.getApplyCount.api(id));
}

export async function getApplyList (params) {
  return request(api.getApplyList.api(params.url), {
    method: api.getApplyList.type,
    body: params.params
  });
}

export async function deleteApply (id) {
  return request(api.deleteApply.api(id), {
    method: api.deleteApply.type,
  });
}