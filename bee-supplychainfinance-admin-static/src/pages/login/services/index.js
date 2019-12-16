import request from '@/common/request';
import apis from './apis';

//登录
export async function login(params = {}) {
  return request(apis.login.api(), {
    method: apis.login.type,
    body: params
  });
}


//获取当前登陆用户的用户信息
export async function getSelfInfo(params = {}) {
  return request(apis.getSelfInfo.api(), {
    method: apis.getSelfInfo.type
  });
}

//退出登录
export async function logout(params) {
  return request('/authPlatformUser/logout', {
    method: 'POST',
    // body: params,
  });
}

//获取当前登陆用户的权限列表
export async function getRoleList(params) {
  return request('/supplychainfinance-user/user/permission', {
    method: 'GET',
  });
}

//用户切换权限
export async function pickRole(params) {
  return request(`/supplychainfinance-user/user/change/permission?permissionId=${params}`, {
    method: 'POST',
    body: params,
  });
}

//查询当前登陆人的角色对应可访问的菜单
export async function getMenus(params) {
  return request('/authResource/resourcesByUser', {
    method: 'GET',
  });
}
export async function getTodo(params) {
  return request('/supplychainfinance-user/user/todo', {
    method: 'GET',
  });
}

//获取预警信息列表
export async function getWarningList(params) {
  return request(`/supplychainfinance-audit/earlyWariningRecord/getWariningRecordByOrderId?${params.url}`, {
    method: 'GET'
  })
}

//获取订单详情代办列表
export async function getOrderTodo(businessMode, orderId) {
  return request(`/supplychainfinance-audit/orderManege/getOrderBackLog?businessMode=${businessMode}&orderId=${orderId}`, {
    method: 'GET'
  })
}
//mock
// export async function login(params) {
//   return request('/api/login', {
//     method: 'POST',
//     body: params,
//   });
// }

