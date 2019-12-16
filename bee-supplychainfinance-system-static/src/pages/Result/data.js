/*
next返回的url，
api:进度请求地址,
status:0提交成功，1是退回成功；
isManage:判断是否是订单页面统一处理，如果是 则返回订单页面列表
busMode: 业务类型 （针对没有存在sessionStorage里的情况）0：采购，1：销售，2：仓储
from: 来时页面路由
fromText: 来时页面名称
eg:/result?id=1901240015381060&status=1&type=buyBondProof&isManage=0
*/
const getType = () =>
  window.g_app._store.getState().routing.location.query.busMode
const getScheduleController = () => {
  const type = sessionStorage.businessMode || getType()
  return type === '0'
    ? 'processScheduleBuy'
    : type === '1'
    ? 'processScheduleSale'
    : type === '2'
    ? 'processScheduleStorage'
    : 'largeProcessScheduleBuy'
}
const data = {
  incoming: {
    next: isManage => (isManage === '1' ? '/incoming' : '/orderManage/index'),
    api: id =>
      `/supplychainfinance-input/${getScheduleController()}/getFlowChart?applyId=${id}`,
    from: '/incoming',
    fromText: '进件管理'
  },
  projectApproval: {
    next: isManage =>
      isManage === '1'
        ? '/approval/projectapproval/index'
        : '/orderManage/index',
    api: id =>
      `/supplychainfinance-input/${getScheduleController()}/getFlowChart?applyId=${id}`,
    from: '/approval/projectapproval/index',
    fromText: '审批管理'
  },
  bail: {
    // 保证金记录
    next: isManage =>
      isManage === '1' ? '/approval/bail/index' : '/orderManage/index',
    api: id =>
      `/supplychainfinance-audit/${
        sessionStorage.businessMode == 0
          ? 'buyBondProof'
          : sessionStorage.businessMode == 1
          ? 'saleBondProof'
          : 'largeBuyBondProof'
      }/record?bondId=${id}`,
    from: '/approval/bail/index',
    fromText: '审批管理'
  },
  goods: {
    // 提货申请记录
    next: isManage =>
      isManage === '1' ? '/approval/goods/index' : '/orderManage/index',
    api: id =>
      `/supplychainfinance-audit/${
        sessionStorage.businessMode == 0
          ? 'buyPickUpApply'
          : 'storagePickUpApply'
      }/record?pickUpApplyId=${id}`,
    from: '/approval/goods/index',
    fromText: '审批管理'
  },
  deferred: {
    // 延期提货申请记录
    next: isManage =>
      isManage === '1' ? '/approval/deferred/index' : '/orderManage/index',
    api: id =>
      `/supplychainfinance-audit/audit/${
        sessionStorage.businessMode == 0 ? 'buy' : 'storage'
      }/delay/record?delayApplyId=${id}`,
    from: '/approval/deferred/index',
    fromText: '审批管理'
  },
  warehouse: {
    // 仓单记录
    next: isManage =>
      isManage === '1' ? '/approval/warehouse/index' : '/orderManage/index',
    api: id =>
      `/supplychainfinance-audit/storageStorehouseBillProof/record?storehouseId=${id}`,
    from: '/approval/warehouse/index',
    fromText: '审批管理'
  },
  settlement: {
    // 结算单审核记录
    next: isManage =>
      isManage === '1' ? '/approval/settlement/index' : '/orderManage/index',
    api: id =>
      `/supplychainfinance-audit/${
        sessionStorage.businessMode == 0
          ? 'buyAccounts'
          : sessionStorage.businessMode == 1
          ? 'saleAccounts'
          : sessionStorage.businessMode == 2
          ? 'storageAccounts'
          : 'largeBuyAccounts'
      }/record?orderId=${id}`,
    from: '/approval/settlement/index',
    fromText: '审批管理'
  },
  contract: {
    // 合同审核记录
    next: isManage =>
      isManage === '1' ? '/approval/contract/index' : '/orderManage/index',
    api: id =>
      `/supplychainfinance-audit/${
        sessionStorage.businessMode == 0
          ? 'buyContractExamine'
          : sessionStorage.businessMode == 1
          ? 'saleContractExamine'
          : sessionStorage.businessMode == 2
          ? 'storageContractExamine'
          : 'largeBuyContractExamine'
      }/record?contractId=${id}`,
    from: '/approval/contract/index',
    fromText: '审批管理'
  }
}

export default data
