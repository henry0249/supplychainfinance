import { request } from '@/common'
import api from './apis'

export async function getPerGroup(params) {
  return request(api.getPerGroup.api())
}

export async function deleteRole(id) {
  return request(api.deleteRole.api(id), {
    method: api.deleteRole.type
  })
}

export async function listRolesBackNoPage(roleType) {
  return request(api.listRolesBackNoPage.api(roleType), {
    method: api.listRolesBackNoPage.type
  })
}

export async function listRoleSystemCode(id) {
  return request(api.listRoleSystemCode.api(id), {
    method: api.listRoleSystemCode.type
  })
}
export async function getRoleDetail(id) {
  return request(api.getRoleDetail.api(id), {
    method: api.getRoleDetail.type
  })
}

export async function addRolesBack(params, id) {
  return request(api.addRolesBack.api(id), {
    method: api.addRolesBack.type,
    body: params
  })
}
