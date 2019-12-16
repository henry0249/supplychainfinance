export default {
    login: {  //管理员登录
        api: () => `/supplychainfinance-user/user/admin/login`,
        type: "POST"
    },
    getSelfInfo: {  //登录用户信息获取
        api: () => `/authPlatformUser/getSelfInfo`,
        type: "GET"
    },

}