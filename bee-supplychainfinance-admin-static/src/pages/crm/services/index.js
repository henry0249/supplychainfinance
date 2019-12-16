import { request } from '@/common'
import api from './apis'

export async function getUserList(params = { pageSize: 10, currentPage: 1 }) {
  return request(api.getUserList.api(params))
}

export async function getUserDetail(id) {
  return request(`/authPlatformUser/getAuthPlatformUserById?id=${id}`, {
    method: 'PUT',
    body: {}
  });
}

export async function editAccountStatus(url) {
  return request(api.editAccountStatus.api(url), {
    method: api.editAccountStatus.type,
    body: {}
  })
}

export async function editUser(params) {
  return request(api.editUser.api(), {
    method: api.editUser.type,
    body: params
  })
}

export async function resetMemberPassword(params) {
  return request(api.resetMemberPassword.api(params), {
    method: api.resetMemberPassword.type,
    body:{}
  })
}

export async function addUser(params) {
  return request(`/authPlatformUser/addAuthPlatformUser`, {
    method: 'PUT',
    body: params
  });
}

export async function getAllQuanxian(id) {
  return request(`/authEnterpriseRole/getEnterpriseRoleTreeList?enterpriseId=${id}`, {
    method: 'POST',
    body:{}
  });
}

export async function getUserQuanxian(id) {
  return request(`/authUserRole/getUserRoleTreeList?userId=${id}`, {
    method: 'POST',
    body:{}
  });
}
