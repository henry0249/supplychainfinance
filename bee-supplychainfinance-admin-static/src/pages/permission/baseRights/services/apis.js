export default {
  getPerGroup: {
    //获取公告列表 type 0集团发文 1规章制度 2内部资讯 3督查通报
    api: () => `/authRole/listRolesBack`,
    type: 'GET'
  },
  deleteRole: {
    //获取公告详情
    api: id => `/authRole/deleteRole?id=${id}`,
    type: 'GET'
  },
  listRoleSystemCode: {
    //获取公告详情
    api: roleId => `/authRole/listRoleSystemCode`,
    type: 'GET'
  },
  listRolesBackNoPage: {
    //删除公告
    api: roleType => `/authRole/listRolesBackNoPage?roleType=${roleType}`,
    type: 'GET'
  },
  addRolesBack: {
    //删除公告
    api: id => `/authRole/addRolesBack`,
    type: 'POST'
  },
  getRoleDetail: {
    //删除公告
    api: id => `/authRole/getRoleDetail?id=${id}`,
    type: 'GET'
  }
}
