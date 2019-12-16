import request from "@/common/request";
import api from '../apis';

export async function getList(params) {
  return request(api.getList.api(params));
}

export async function getApprovalManagementList(params) {
  return request(api.getApprovalManagementList.api(params));
}

export async function getApprovalManagementDetail(params) {
  return request(api.getApprovalManagementDetail.api(params));
}

export async function configureApprovalManagement(params) {
  return request(api.configureApprovalManagement.api(params), {
    method: api.configureApprovalManagement.type,
    body: params
  });
}

export async function findUpdateCloumns(businessMode) {
  return request(api.findUpdateCloumns.api(businessMode), {
    method: api.findUpdateCloumns.type,
  });
}

export async function getTriggerType(businessMode) {
  return request(api.getTriggerType.api(businessMode), {
    method: api.getTriggerType.type,
  });
}

export async function findLowGradeConfig(id) {
  return request(api.findLowGradeConfig.api(id), {
    method: api.findLowGradeConfig.type,
  });
}

export async function saveLowGradeConfig(params) {
  return request(api.saveLowGradeConfig.api(), {
    method: api.saveLowGradeConfig.type,
    body: params
  });
}

export async function deleteLowGradeConfig(params) {
  return request(api.deleteLowGradeConfig.api(), {
    method: api.deleteLowGradeConfig.type,
    body: params
  });
}

export async function saveEnterprisePermission(params) {
  return request(api.saveEnterprisePermission.api(), {
    method: api.saveEnterprisePermission.type,
    body: params
  });
}

export async function getEnterprisePermission(params) {
  return request(api.getEnterprisePermission.api(params), {
    method: api.getEnterprisePermission.type
  });
}

export async function getAllPermissions(params) {
  return request(api.getAllPermissions.api(params), {
    method: api.getAllPermissions.type
  });
}

export function getLists() {
  return request(api.getLists.api(), {
    method: api.getLists.type
  })
}

export function getAllRoles(params) {
  return request(api.getAllRoles.api(params), {
    method: api.getAllRoles.type
  })
}

export function getConfigs(params) {
  return request(api.getConfigs.api(params), {
    method: api.getConfigs.type
  })
}

export function saveConfigs(params) {
  return request(api.saveConfigs.api(), {
    method: api.saveConfigs.type,
    body: params
  })
}

export function addRole(params) {
  return request(api.addRole.api(), {
    method: api.addRole.type,
    body: params
  })
}

export function deleteRole(id) {
  return request(api.deleteRole.api(id), {
    method: api.deleteRole.type
  })
}

export function getAllUsers(params) {
  return request(api.getAllUsers.api(params), {
    method: api.getAllUsers.type
  })
}

export function saveUsers(params) {
  return request(api.saveUsers.api(), {
    method: api.saveUsers.type,
    body: params
  })
}

export function getLogs(params) {
  return request(api.getLogs.api(params), {
    method: api.getLogs.type,
  })
}
