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
  listSubSystemCode: {
    //获取公告详情
    api: roleId => `/authRole/listSubSystemCode`,
    type: 'GET'
  },
  listResourcesBySubSys: {
    //获取资源
    api: subSys => `/authResource/listResourcesBySubSys?subSys=${subSys}`,
    type: 'GET'
  },
  listInterfacesBySubSys: {
    //获取接口
    api: (subSys, beeRouter) => `/authInterface/listInterfacesBySubSys?subSys=${subSys}${beeRouter ? '&beeRouter=' + encodeURIComponent(beeRouter) : ''}`,
    type: 'GET'
  },
  listSubResourceBackNoPage: {
    //获取下一级资源
    api: subSys => `/authResource/listSubResourceBackNoPage?id=${subSys}`,
    type: 'GET'
  },
  listRolesBackNoPage: {
    //删除公告
    api: params => `/authRole/listRolesBackNoPage`,
    type: 'POST'
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
  },
  listSubRolesBackNoPage: {
    //删除公告
    api: id => `/authRole/listSubRolesBackNoPage?id=${id}`,
    type: 'GET'
  }
}
