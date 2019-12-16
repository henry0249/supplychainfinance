
const renderUrl = (params) => {//todo 删除
    let url = ''
    for (let key in params) {
        if (params[key] !== null && params[key] !== undefined) {
            console.log(params[key])
            url += `&${key}=${params[key]}`
        }
    }
    return url;
}

export default {
    getList: {  //企业列表
        api: ({ permissionType, enterpriseName, currentPage, pageSize }) =>
            `/supplychainfinance-user/enterprise/getEnterpriseList?permissionType=${permissionType}${enterpriseName ? '&enterpriseName=' + enterpriseName : ''}&currentPage=${currentPage}&pageSize=${pageSize}`,
        type: "GET"
    },
    saveLowRiskConfig: {//风控配置新增和修改接口
        api: () =>
            `/supplychainfinance-common/lowRiskConfig/save/config`,
        type: "POST"
    },
    getApprovalManagementList: {  //审批管理列表
        api: ({ id }) =>
            `/supplychainfinance-user/enterprise/getApprovalManagementList?id=${id}`,
        type: "GET"
    },

    getApprovalManagementDetail: {  //审批管理详情
        api: ({ processType, id }) =>
            `/supplychainfinance-user/enterprise/getApprovalManagementDetail?processType=${processType}&id=${id}`,
        type: "GET"
    },
    configureApprovalManagement: {// 审批管理-审批配置
        api: ({ id }) => `/supplychainfinance-user/enterprise/configureApprovalManagement?id=${id}`,
        type: "POST"
    },

    /*企业角色*/
    saveEnterprisePermission: {//保存企业角色信息
        api: () => `/supplychainfinance-user/enterprise/saveEnterprisePermission`,
        type: "POST"
    },
    getEnterprisePermission: {//根据企业id查询企业角色
        api: ({ id }) => `/supplychainfinance-user/enterprise/getEnterprisePermission?enterpriseId=${id}`,
        type: "GET"
    },
    getAllPermissions: {//获取所有角色
        api: () => `/supplychainfinance-user/user/permission/all`,
        type: "GET"
    },
    getAllRoles: {
        api: (params) => `/supplychainfinance-user/enterprise/getEnterpriseRoles?pageSize=5${renderUrl(params)}`,
        type: 'GET'
    },
    getConfigs: {
        api: (roleId) => `/supplychainfinance-user/user/role/info?roleId=${roleId}`,
        type: 'GET'
    },
    saveConfigs: {
        api: () => '/supplychainfinance-user/user/role/admin/updateRole',
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
        api: ({ enterpriseId, roleId }) => `/supplychainfinance-user/enterprise/getRoleUserList?enterpriseId=${enterpriseId}&roleId=${roleId}`,
        type: 'GET'
    },
    saveUsers: {
        api: () => '/supplychainfinance-user/enterprise/saveRoleUserInfo',
        type: 'POST'
    },
    getLogs: {
        api: (currentPage) => `/supplychainfinance-user/user/permission/log?pageSize=10&currentPage=${currentPage}`,
        type: 'GET'
    }


}