export default {
  getUserList: {
    //获取公告列表 type 0集团发文 1规章制度 2内部资讯 3督查通报
    api: ({ pageSize = 10, currentPage = 1 }) =>
      `/manager/getUserList?pageSize=${pageSize}&currentPage=${currentPage}`,
    type: 'GET'
  },
  getUserDetail: {
    //获取用户详情
    api: (url) => `${url}`,
    type: 'POST'
  },
  editAccountStatus: {
    api: url => `/authPlatformUser/updataById?${url}`,
    type: 'POST'
  },
  editUser: {
    api: id => `/authPlatformUser/updataAuthPlatformUser`,
    type: 'POST'
  },
  resetMemberPassword: {
    api: param => `/authPlatformUserEnterprise/resetMemberPassword?${param}`,
    type: 'POST'
  }
}
