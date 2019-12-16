export default {
  getEnterprisePermission: {//根据企业id查询企业角色
    api: () => '/supplychainfinance-user/enterprise/getEnterprisePermission',
    type: "GET"
  },
  getAllRoles: {
    api: (page) => `/supplychainfinance-user/enterprise/getEnterpriseRoles?pageSize=5&currentPage=${page}`,
    type: 'GET'
  },
  getConfigs: {
    api: (roleId) => `/supplychainfinance-user/user/role/info?roleId=${roleId}`,
    type: 'GET'
  },
  saveConfigs: {
    api: () => '/supplychainfinance-user/user/role/updateEnterpriseRole',
    type: 'POST'
  },
  addRole: {
    api: () => '/supplychainfinance-user/user/role/createEnterpriseRole',
    type: 'POST'
  },
  deleteRole: {
    api: (id) => `/supplychainfinance-user/user/role/deleteEnterpriseRole?roleId=${id}`,
    type: 'POST'
  },
  getAllUsers: {
    api: (roleId) => `/supplychainfinance-user/enterprise/getRoleUserList?roleId=${roleId}`,
    type: 'GET'
  },
  saveUsers: {
    api: () => '/supplychainfinance-user/enterprise/saveRoleUserInfo',
    type: 'POST'
  },
  getLogs: {
    api: (currentPage) => `/supplychainfinance-user/user/permission/log?pageSize=10&currentPage=${currentPage}`,
    type: 'GET'
  },
  getApprovalManagementList: {  //审批管理列表
    api: () =>
      `/supplychainfinance-user/enterprise/getApprovalManagementList`,
    type: "GET"
  },
  getApprovalManagementDetail: {  //审批管理详情
    api: ({ businessMode, processType }) =>
      `/supplychainfinance-user/enterprise/getApprovalManagementDetail?businessMode=${businessMode}&processType=${processType}`,
    type: "GET"
  },
  configureApprovalManagement: {// 审批管理-审批配置
    api: () => `/supplychainfinance-user/enterprise/configureApprovalManagement`,
    type: "POST"
  },
}