export default {
  //企业管理相关接口
  getTypeWithCount: {  //获取审核结果类型及对应企业数
    api: () => `/supplychainfinance-user/enterprise/getTypeWithCountForManage`,
    type: "GET"
  },
  enterpriseAudit: {  //企业管理-审核企业
    api: (params) => `/supplychainfinance-user/enterprise/auditEnterpriseForManage`,
    type: "POST"
  },
  getEnterpriseInfo: {  //企业管理-查看详情
    api: (params) => `/supplychainfinance-user/enterprise/getEnterpriseDetailForManage?platformEnterpriseId=${params}`,
    type: "GET"
  }, 
  modifyAdmin: {  //变更企业管理员
    api: (params) => `/enterprisesCheck/modifyAdmin`,
    type: "POST"
  },
}