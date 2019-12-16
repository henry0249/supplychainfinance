import request from "@/common/request";
import api from '../apis';

export async function getList(params) {
  return request(api.getList.api(params));
}

export function updateById(params) {
  return request(api.updateById.api(), {
    method: api.updateById.type,
    body: params
  })
}

export function getLogs(params) {
  return request(api.getLogs.api(params), {
    method: api.getLogs.type,
  })
}

export async function getRoleByPermission(params) {
  return request(api.getRoleByPermission.api(params), {
    method: api.getRoleByPermission.type,
  });
}

export function getConfigs(params) {
  return request(api.getConfigs.api(params), {
    method: api.getConfigs.type,
  })
}

export function saveConfigs(params) {
  return request(api.saveConfigs.api(), {
    method: api.saveConfigs.type,
    body: params
  })
}
