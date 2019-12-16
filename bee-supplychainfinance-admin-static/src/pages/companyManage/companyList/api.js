export default {
  getInfo: {
    api: (params) => `/authEnterprise/${params}`,
    type: 'GET'
  },
  //查询企业历史详情
  getComInfo: {
    api: (params) => `/authEnterprise/history/${params}`,
    type: 'GET'
  },
  getRegion: {
    api: () => `/api/user/region/getAllRegion`,
    type: 'GET'
  },
  getIndustry: {
    api: () => '/industry/getAllIndustry',
    type: 'GET'
  },
  // updateInfo: {
  //   api: () => `/enterprisesCheck/updateCompanyInfo`,
  //   type: 'POST'
  // },
  //老得接口
  getData: {
    api: (url) => `/enterprisesRelationUserCheck/getEnterprisesRelationUserCheckApplyList${url}`,
    type: 'POST'
  },
  checkCompany: {
    api: () => `/enterprisesRelationUserCheck/upDateEnterprisesRelationUserCheck`,
    type: 'POST'
  },
  getDetails: {
    api: (id) => `/enterprisesRelationUserCheck/enterprisesRelationUserCheckDetails?id=${id}`,
    type: 'POST'
  },
  //权限相关接口
  //根据条件查询企业
  getCompanys: {
    api: (url) => `/authEnterprise/conditional?${url}`,
    type: 'POST'
  },
  //修改企业
  updateInfo: {
    api: () => `/authEnterprise/update`,
    type: 'POST'
  },
  //添加企业
  addCompany: {
    api: () => `/authEnterprise/add`,
    type: 'POST'
  },
  //删除企业
  deleteCompany: {
    api: (params) => `/authEnterprise/del`,
    type: 'POST'
  },
  //查看单个企业详情
  authEnterprise: {
    api: (params) => `/authEnterprise?${params}`,
    type: 'GET'
  },
  //查询所有企业信息--树形结构
  getAllCompanysTree: {
    api: () => `/authEnterprise/all/tree`,
    type: 'GET'
  },
  //查询企业下的所有应用树
  // getEnterpriseRoleTreeList: {
  //   api: (params) => `/authEnterpriseRole/getEnterpriseRoleTreeList?enterpriseId=${params}`,
  //   type: 'POST'
  // },
  getEnterpriseRoleTreeList: {
    api: (params) => `/authFunctionRole/get/allFunction`,
    type: 'GET'
  },
  //保存企业角色配置的修改
  updateRole: {
    api: (params) => `/authFunctionRole/updateRole`,
    type: 'POST'
  },
  //查询企业下所有已开通的功能
  getFunsIds: {
    api: (params) => `/authFunctionRole/getFuns?enterpriseId=${params}`,
    type: 'GET'
  },
  //查询所有企业信息--树形结构
  getAllCompanysTree: {
    api: () => `/authEnterprise/all/tree`,
    type: 'GET'
  },
}