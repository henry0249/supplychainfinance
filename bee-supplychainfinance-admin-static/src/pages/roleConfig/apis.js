export default {
    getList: {  //查询已配置的低分规则
        api: ({ keyword }) =>
            `/supplychainfinance-user/user/permission/enterprise/permissions?keyword=${keyword}`,
        type: "GET"
    },

    updateById: {//后台管理员--编辑企业角色名称
        api: () => '/supplychainfinance-user/user/permission/admin/updateById',
        type: 'POST'
    },

    getRoleByPermission: {//权限组列表
        api: ({ currentPage, id }) => `/supplychainfinance-user/user/permission/getInfoByPermissionId?currentPage=${currentPage}&pageSize=${5}&permissionId=${id}`,
        type: "GET"
    },
    getConfigs: {
        api: ({ permissionId }) => `/supplychainfinance-user/user/permission/getConfiguration?permissionId=${permissionId}`,
        type: 'GET'
    },
    saveConfigs: {
        api: () => '/supplychainfinance-user/user/permission/addConfiguration',
        type: 'POST'
    },

    getLogs: {
        api: (currentPage) => `/supplychainfinance-user/user/permission/log?pageSize=10&currentPage=${currentPage}`,
        type: 'GET'
    }

}