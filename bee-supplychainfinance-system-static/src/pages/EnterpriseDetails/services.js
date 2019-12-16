import request from '@/utils/request';
import apis from "./apis"

export function getEnterprisePermission() {
  return request(apis.getEnterprisePermission.api(), {
    method: apis.getEnterprisePermission.type
  });
}

export function getAllRoles(page) {
  return request(apis.getAllRoles.api(page), {
    method: apis.getAllRoles.type
  })
}

export function getConfigs(roleId) {
  return request(apis.getConfigs.api(roleId), {
    method: apis.getConfigs.type
  })
}

export function saveConfigs(params) {
  return request(apis.saveConfigs.api(), {
    method: apis.saveConfigs.type,
    body: params
  })
}

export function addRole(params) {
  return request(apis.addRole.api(), {
    method: apis.addRole.type,
    body: params
  })
}

export function deleteRole(id) {
  return request(apis.deleteRole.api(id), {
    method: apis.deleteRole.type
  })
}

export function getAllUsers(roleId) {
  return request(apis.getAllUsers.api(roleId), {
    method: apis.getAllUsers.type
  })
}

export function saveUsers(params) {
  return request(apis.saveUsers.api(), {
    method: apis.saveUsers.type,
    body: params
  })
}

export function getLogs(currentPage) {
  return request(apis.getLogs.api(currentPage), {
    method: apis.getLogs.type,
  })
}

export async function configureApprovalManagement(params) {
  return request(apis.configureApprovalManagement.api(params), {
    method: apis.configureApprovalManagement.type,
    body: params
  });
}

export async function getApprovalManagementList(params) {
  return request(apis.getApprovalManagementList.api(params));
}

export async function getApprovalManagementDetail(params) {
  return request(apis.getApprovalManagementDetail.api(params));
}