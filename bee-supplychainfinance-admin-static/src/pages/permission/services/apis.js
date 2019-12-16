export default {
  getPerGroup: {
    //获取公告列表 type 0集团发文 1规章制度 2内部资讯 3督查通报
    api: () => `/manager/permission/group`,
    type: 'GET'
  },
  getRoleDetail: {
    //获取公告详情
    api: roleId => `/manager/role/detail`,
    type: 'POST'
  },
  deleteRole: {
    //删除公告
    api: id => `/manager/del/role?roleId=${id}`,
    type: 'POST'
  },
  editRole: {
    //删除公告
    api: id => `/manager/edit/role`,
    type: 'POST'
  },
  listSubSystemCode: {
    //获取公告详情
    api: roleId => `/authRole/listSubSystemCode`,
    type: 'GET'
  },
}
