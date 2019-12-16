export default {
    //企业管理相关接口
    getTypeWithCount: {  //获取审核结果类型及对应企业数
        api: () => `/api/enterpriseManage/getTypeWithCount`,
        type: "GET"
    },
    getEnterpriseList: {  //企业管理条件查询列表
        api: () => `/supplychainfinance-user/enterprise/getEnterpriseListForManage`,
        type: "GET"
    },
    getEnterpriseInfo: {  //企业管理-查看详情
        api: (params) => `/enterprisesCheck/Info?id=${params}`,
        type: "GET"
    },
    modifyAdmin: {  //变更企业管理员
        api: (params) => `/enterprisesCheck/modifyAdmin`,
        type: "POST"
    },
    enterpriseAudit: {  //企业管理-审核企业
        api: (params) => `/enterprisesCheck/audit`,
        type: "POST"
    },
    getComList: {  //企业列表
        api: () => `/authEnterprise/conditional/all`,
        type: "GET"
    },
    getRegion: {
        api: () => `/supplychainfinance-common/regionInfo/getAllRegion`,
        type: 'GET'
    },
    findAllRegionById: {
        api: (id) => `/supplychainfinance-common/regionInfo/findAllRegionById?id=${id}`,
        type: 'GET'
    },
    modifyEnterprise: {
        api: () => '/supplychainfinance-user/enterprise/updateEnterpriseForManage',
        type: 'POST'
    }
}