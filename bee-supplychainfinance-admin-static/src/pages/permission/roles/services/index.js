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

export async function listRolesBackNoPage(params) {
  return request(api.listRolesBackNoPage.api(), {
    method: api.listRolesBackNoPage.type,
    body: params
  })
}
export async function listSubRolesBackNoPage(id) {
  return request(api.listSubRolesBackNoPage.api(id), {
    method: api.listSubRolesBackNoPage.type
  })
}

export async function listRoleSystemCode(id) {
  return request(api.listRoleSystemCode.api(id), {
    method: api.listRoleSystemCode.type
  })
}
export async function listResourcesBySubSys(subSys) {
  return request(api.listResourcesBySubSys.api(subSys), {
    method: api.listResourcesBySubSys.type
  })
}
export async function listInterfacesBySubSys(subSys,beeRouter) {
  return request(api.listInterfacesBySubSys.api(subSys,beeRouter), {
    method: api.listInterfacesBySubSys.type
  })
}
export async function listSubSystemCode(id) {
  return request(api.listSubSystemCode.api(id), {
    method: api.listSubSystemCode.type
  })
}
export async function listSubResourceBackNoPage(id) {
  return request(api.listSubResourceBackNoPage.api(id), {
    method: api.listSubResourceBackNoPage.type
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
