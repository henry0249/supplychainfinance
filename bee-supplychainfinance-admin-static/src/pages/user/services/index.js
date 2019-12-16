import { request } from '@/common'
import api from './apis'

export async function getArticles(params = { type: 1, size: 14, page: 1 }) {
  return request(api.getArticles.api(params))
}

export async function getArticle(params) {
  return request(api.getArticle.api(params))
}

export async function getArticleTypes(params) {
  return request(api.getArticleTypes.api())
}

export async function getAllArticlesType(params) {
  return request(api.getAllArticlesType.api())
}

export async function editArticleType(params) {
  return request(api.editArticleType.api(params), {
    method: api.editArticleType.type
  })
}
export async function checkTypeUnique(params) {
  return request(api.checkTypeUnique.api(params), {
    method: api.checkTypeUnique.type
  })
}
export async function deleteArticleType(id) {
  return request(api.deleteArticleType.api(id), {
    method: api.deleteArticleType.type
  })
}

export async function deleteArticle(id) {
  return request(api.deleteArticle.api(id), {
    method: api.deleteArticle.type
  })
}

export async function getArticlesByCondition(params, query) {
  return request(api.getArticlesByCondition.api() + `?${query}`, {
    method: api.getArticlesByCondition.type,
    body: params
  })
}

export async function editArticle(params, id) {
  return request(api.editArticle.api(id), {
    method: api.editArticle.type,
    body: params
  })
}

export async function getBackstageList(url, params) {
  return request(`/supplychainfinance-user/user/adminUserList?${url}`, {
    method: 'POST',
    body: params
  })
}

export async function getMiddleList(url, params) {
  return request(`/supplychainfinance-user/user/middleUserList?${url}`, {
    method: 'POST',
    body: params
  })
}


export async function forbitMiddle(params) {
  //111
  return request(`/authPlatformUser/updataIn`, {
    method: 'POST',
    body: params
  })
}

export async function getComList() {
  return request(`/authEnterprise/user/flat`, {
    method: 'GET'
  })
}
export async function getUserEnterprises(id) {
  return request(`/authEnterprise/userEnterprises/${id}`, {
    method: 'GET'
  })
}
export async function getAllEnterprises(id) {
  return request(`/authEnterprise/all`, {
    method: 'GET'
  })
}

export async function getComListCa() {
  return request(`/authEnterprise/all/tree`, {
    method: 'GET'
  })
}

export async function getRole() {
  return request(``, {
    method: 'GET'
  })
}

export async function middleforbit(params) {
  return request(`/authPlatformUser/updataIn`, {
    method: 'POST',
    body: params
  })
}

export async function getMiddleDetail(id) {
  return request(`/authPlatformUser/getAuthPlatformUserInById?id=${id}`, {
    method: 'PUT',
    body: {}
  })
}

export async function editMiddleUser(params) {
  return request(`/authPlatformUser/updateAuthPlatformUserOneIn`, {
    method: 'POST',
    body: params
  })
}

export async function getAllQuanxian(id) {
  return request(
    `/authEnterpriseRole/getEnterpriseRoleTreeList?enterpriseId=${id}`,
    {
      method: 'POST',
      body: {}
    }
  )
}

export async function getUserQuanxian(id) {
  return request(`/authUserRole/getUserRoleTreeList?userId=${id}`, {
    method: 'POST',
    body: {}
  })
}




export async function getList(params) {
  return request(api.getList.api(params.url), {
    body: params.params,
    method: api.getList.type
  });
}

// 获取用户详情
export async function getUserInfo(id) {
  return request(api.getUserInfo.api(id));
}

// 获取所有省区市
export async function getRegion() {
  return request(api.getRegion.api());
}

// 保存企业信息
export async function saveUserInfo(params) {
  return request(api.saveUserInfo.api(), {
    body: params,
    method: api.saveUserInfo.type
  });
}

export async function editAccountStatus(url) {
  return request(api.editAccountStatus.api(url), {
    method: api.editAccountStatus.type,
    body: {}
  })
}

// 新版本权限--后台--后台用户--编辑用户--详细查询
export async function getAdminUserById(id) {
  return request(api.getAdminUserById.api(id));
}

export async function getMiddleUserById(id) {
  return request(api.getMiddleUserById.api(id));
}

export async function editAdmin(params) {
  return request(api.editAdmin.api(), {
    method: api.editAdmin.type,
    body: params
  })
}


export async function forbit(url) {
  return request(`/supplychainfinance-user/user/forbiddenAccount?${url}`, {
    method: 'POST',
    body: {}
  })
}
