const getType = () => window.g_app._store.getState().incoming.mode
const apiList = [
  'entrustBuyDetailBuy',
  'entrustSaleDetailSale',
  'financeStorageDetail',
  '',
  'largeEntrustBuyDetail'
]
const stepListOne = [
  'saveBuyDetailFirst',
  'saveSaleDetailFirst',
  'saveStorageDetailFirst',
  '',
  'saveBuyDetailFirst'
]
const stepListTwo = [
  'saveBuyDetailSecond',
  'saveSaleDetailSecond',
  'saveStorageDetailSecond',
  '',
  'saveBuyDetailSecond'
]
const stepListThree = [
  'saveBuyDetailThree',
  'saveSaleDetailThree',
  'saveStorageDetailThree',
  '',
  'saveBuyDetailThree'
]
const stepListFour = [
  'saveBuyDetailFour',
  'saveSaleDetailFour',
  'saveStorageDetailFour',
  '',
  'saveBuyDetailFour'
]
export default {
  //立项报告第一步保存
  saveDetailFirst: {
    api: () =>
      `/supplychainfinance-input/${apiList[getType()]}/${
        stepListOne[getType()]
      }`,
    type: 'POST'
  },
  //立项报告第二步保存
  saveDetailSecond: {
    api: () =>
      `/supplychainfinance-input/${apiList[getType()]}/${
        stepListTwo[getType()]
      }`,
    type: 'POST'
  },
  //立项报告第三步保存
  saveDetailThird: {
    api: () =>
      `/supplychainfinance-input/${apiList[getType()]}/${
        stepListThree[getType()]
      }`,
    type: 'POST'
  },
  //立项报告第四步保存
  saveDetailFourth: {
    api: () =>
      `/supplychainfinance-input/${apiList[getType()]}/${
        stepListFour[getType()]
      }`,
    type: 'POST'
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
  },
  //获取下拉列表信息
  getSysCodeInfo: {
    api: codeTypeId =>
      `/supplychainfinance-common/sysCode/getSysCodeInfo?codeTypeId=${codeTypeId}`,
    type: 'GET'
  },
  //根据标的物名查询详细信息
  getSubjectMatterInfo: {
    api: name =>
      `/supplychainfinance-common/subjectMatter/getSubjectMatterInfo?tradeGoods=${name}`,
    type: 'GET'
  },
  getSubjectMatterList: {
    api: name =>
      `/supplychainfinance-common/subjectMatter/getSubjectMatterList`,
    type: 'GET'
  },
  //获取单位列表
  getSubjectMatterPriceUnitList: {
    api: name =>
      `/supplychainfinance-common/subjectMatter/getSubjectMatterPriceUnitList`,
    type: 'GET'
  },
  getApplyCount: {
    //申请数统计
    api: id =>
      `/supplychainfinance-input/commonEntrustApply/getApplyCountForInput`,
    type: 'GET'
  },
  getApplyList: {
    //条件查询获取贷前委托采购申请列表
    api: url =>
      `/supplychainfinance-input/commonEntrustApply/getApplyListByCondition?${url}`,
    type: 'POST'
  },
  checkForwardingCompany: {
    //委托销售验证货代公司新接口
    api: url => `/supplychainfinance-common/checkForwardingCompany?${url}`,
    type: 'GET'
  },
  deleteApply: {
    //删除贷前申请
    api: ({ id, mode }) =>
      `/supplychainfinance-input/${
        mode === 0
          ? 'entrustBuyApply'
          : mode === 1
          ? 'entrustSaleApply'
          : mode === 2
          ? 'financeStorageApply'
          : 'largeEntrustBuyApply'
      }/disableApply?applyId=${id}`,
    type: 'POST'
  },
  //企业关键字精确获取详细信息
  getFullDetailsByName: {
    //申请数统计
    api: params =>
      `/supplychainfinance-common/checkCompany?companyName=${
        params.companyName
      }&applyId=${params.applyId}&companyBaseId=${params.companyBaseId}`,
    type: 'GET'
  }
}
