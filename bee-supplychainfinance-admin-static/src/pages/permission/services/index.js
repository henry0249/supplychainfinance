import { request } from '@/common'
import api from './apis'

export async function getPerGroup(params) {
  return request(api.getPerGroup.api())
}

export async function getRoleDetail(id) {
  let str = ''
  if (id) {
    str = api.getRoleDetail.api() + `?roleId=${id}`
  } else {
    str = api.getRoleDetail.api()
  }
  return request(str, {
    method: api.getRoleDetail.type
  })
}

export async function deleteRole(id) {
  return request(api.deleteRole.api(id), {
    method: api.deleteRole.type
  })
}

export async function editRole(params, id) {
  return request(api.editRole.api(id), {
    method: api.editRole.type,
    body: params
  })
}
export async function listSubSystemCode(id) {
  return request(api.listSubSystemCode.api(id), {
    method: api.listSubSystemCode.type
  })
}
export async function getBackDetail(id) {
  return request(`?${id}`, {
    method: 'POST',
    body:{}
  });
}

export async function backForbit(id) {
  return request(`?${id}`, {
    method: 'POST',
    body:{}
  });
}
