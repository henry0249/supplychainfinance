export default {
  getFlowChart: {
    //审核流程图
    api: applyId =>
      `/supplychainfinance-input/${getScheduleController()}/getFlowChart?applyId=${applyId}`,
    type: 'GET'
  },
  getProcessScheduleDetail: {
    //立项审批详情
    api: applyId =>
      `/supplychainfinance-input/${getScheduleController()}/getProcessScheduleDetail?applyId=${applyId}`,
    type: 'GET'
  },
  getCount: {
    //立项审批申请数统计 首页
    api: id => `/supplychainfinance-input/commonProcessSchedule/getOrderCounts`,
    type: 'GET'
  },
  getList: {
    //条件查询获取贷前立项审批列表 首页
    api: url =>
      `/supplychainfinance-input//commonEntrustApply/getApplyListForEntrust?${url}`,
    type: 'POST'
  },
  getReport: {
    //立项报告获取立项报告
    api: id =>
      `/supplychainfinance-input/${getDetailController()}/getProjectReport?applyId=${id}`,
    type: 'GET'
  },
  getPriceTrend: {
    //查询价格走势
    api: param => `/supplychainfinance-input/priceTrend/getPriceTrend?${param}`,
    type: 'GET'
  },
  getIsAudit: {
    //查询决策委员会按钮是否能够点击
    api: param =>
      `/supplychainfinance-input/${getCaucasController()}/getIsAudit`,
    type: 'POST'
  },
  getScoreRisk: {
    //立项申请详情(一二三风险评分/宏观经济指数/风险项信息) 获取并写入数据
    api: param =>
      `/supplychainfinance-input/${getApplyController()}/getRiskScore?applyId=${param}`,
    type: 'GET'
  },
  getScoreRiskMacroeconomic: {
    //立项申请详情(一二三风险评分/宏观经济指数/风险项信息) 获取数据
    api: param =>
      `/supplychainfinance-input/${getApplyController()}/getScoreRiskMacroeconomic?applyId=${param}`,
    type: 'GET'
  },
  getLogs: {
    //获取日志
    api: applyId =>
      `/supplychainfinance-input/${getLogController()}/getOperateLog?applyId=${applyId}`,
    type: 'POST'
  },
  queryBackRole: {
    //查询可退回人员
    api: () =>
      `/supplychainfinance-input/${getScheduleController()}/searchPeopleToSendBack`,
    type: 'POST'
  },
  refuse: {
    //决策委员会退回
    api: param =>
      `/supplychainfinance-input/${getCaucasController()}/refuseApply`,
    type: 'POST'
  },
  submitBack: {
    //退回立项审批
    api: () =>
      `/supplychainfinance-input/${getScheduleController()}/sendBackProcessSchedule`,
    type: 'POST'
  },
  agree: {
    //决策委员会同意申请
    api: id =>
      `/supplychainfinance-input/${getCaucasController()}/agreeApply?applyId=${id}`,
    type: 'POST'
  },
  agreeApproval: {
    //提交立项审批
    api: () =>
      `/supplychainfinance-input/${getScheduleController()}/submitProcessSchedule`,
    type: 'POST'
  },
  getRiskFactor: {
    //申请单id展示风险要素信息的值
    api: id =>
      `/supplychainfinance-input/${geRiskElemenController()}/riskElementInfo?applyId=${id}`,
    type: 'GET'
  },
  getAuditMsg: {
    //查询审批意见
    api: id =>
      `/supplychainfinance-input/${geRiskElemenController()}/getAuditMsg?applyId=${id}`,
    type: 'GET'
  },
  addRiskFactor: {
    //提交风险要素项
    api: id =>
      `/supplychainfinance-input/${geRiskElemenController()}/addRiskElements`,
    type: 'POST'
  },
  getEnclosure: {
    //查询附件信息
    api: applyId =>
      `/supplychainfinance-input/${getDetailController()}/getFileInfo?applyId=${applyId}`,
    type: 'GET'
  },
  getOtherInfo: {
    //立项审批详情
    api: applyId =>
      `/supplychainfinance-input/${getScheduleController()}/getProcessScheduleDetail?applyId=${applyId}`,
    type: 'GET'
  },

  //获取委托采购立项报告已填信息
  entrustBuyDetailBuy: {
    api: applyId =>
      `/supplychainfinance-input/entrustBuyDetailBuy/getApplyDetail?applyId=${applyId}`,
    type: 'GET'
  },
  //获取大企业委托采购立项报告已填信息
  largeEntrustBuyDetail: {
    api: applyId =>
      `/supplychainfinance-input/largeEntrustBuyDetail/getApplyDetail?applyId=${applyId}`,
    type: 'GET'
  },
  //获取委托销售立项报告已填信息
  entrustSaleDetailSale: {
    api: applyId =>
      `/supplychainfinance-input/entrustSaleDetailSale/getApplyDetail?applyId=${applyId}`,
    type: 'GET'
  },
  //获取金融仓储立项报告已填信息
  financeStorageDetail: {
    api: applyId =>
      `/supplychainfinance-input/financeStorageDetail/getApplyDetail?applyId=${applyId}`,
    type: 'GET'
  }
}

//获得当前业务类型
const getType = () => window.g_app._store.getState().application.businessMode

//获得当前审批的controller
const getScheduleController = () =>
  getType() == 0
    ? 'processScheduleBuy'
    : getType() == 1
    ? 'processScheduleSale'
    : getType() == 2
    ? 'processScheduleStorage'
    : 'largeProcessScheduleBuy'

//获得当前立项报告的controller
const getDetailController = () =>
  getType() == 0
    ? 'entrustBuyDetailBuy'
    : getType() == 1
    ? 'entrustSaleDetailSale'
    : getType() == 2
    ? 'financeStorageDetail'
    : 'largeEntrustBuyDetail'

//获得申请相关接口的controller
const getApplyController = () =>
  getType() == 0
    ? 'entrustBuyApply'
    : getType() == 1
    ? 'entrustSaleApply'
    : getType() == 2
    ? 'financeStorageApply'
    : 'largeEntrustBuyApply'

//获得操作日志的controller
const getLogController = () =>
  getType() == 0
    ? 'operateLogBuy'
    : getType() == 1
    ? 'operateLogSale'
    : getType() == 2
    ? 'operateStorageLog'
    : 'operateLogLargeBuy'

//获得决策委员会操作的controller
const getCaucasController = () =>
  getType() == 0
    ? 'CaucasBuy'
    : getType() == 1
    ? 'CaucasSale'
    : getType() == 2
    ? 'caucasStorage'
    : 'largeCaucasBuy'

//获得风险要素信息的controller
const geRiskElemenController = () =>
  getType() == 0
    ? 'riskElementBuy'
    : getType() == 1
    ? 'riskElementSale'
    : getType() == 2
    ? 'riskElementStorage'
    : 'largeRiskElementBuy'
