export default {
  getBoard: {
    api: () => '/supplychainfinance-audit/lookBoard/countTopTitle',
    type: 'GET'
  },
  getSettlementMoneyChart: {//各业务资金占比 【结算中心、超级管理员】 展开 0否 1是
    api: ({ detail = 0, companyName = null }) => `/supplychainfinance-audit/lookBoard/${companyName ?
      'getOccupyRatioForCompany' : 'getSettlementMoneyChart'}?detail=${detail}${companyName ? '&companyName=' + companyName : ''}`,
    type: 'GET'
  },
  getFinancialChart: {
    api: ({ type, companyName }) => `/supplychainfinance-audit/financeCollectionPayment/getPayment?paymentType=${type}${companyName ? `&companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  getFinancialData: {
    api: ({ companyName }) => `/supplychainfinance-audit/lookBoard/getFinancialData${companyName ? `?companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  getListInfo: {
    api: ({ type, current, companyName }) => type === 'pay' ? `/supplychainfinance-audit/lookBoard/getFinancialData/alreadyInfo?currentPage=${current}&pageSize=20${companyName ? `&companyName=${companyName}` : ''}`
      : `/supplychainfinance-audit/lookBoard/getFinancialData/shouldInfo?currentPage=${current}&pageSize=20${companyName ? `&companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  getInvoice: {//根据用户查询开收票信息
    api: ({ companyName = null }) => `/supplychainfinance-audit/financeCollectionPayment/getInvoice${companyName ? '?companyName=' + companyName : ''}`,
    type: 'GET'
  },
  getBillData: {//查询票据中心（4个数据的值）
    api: ({ companyName = null }) => `/supplychainfinance-audit/lookBoard/getBillData${companyName ? '?companyName=' + companyName : ''}`,
    type: 'GET'
  },
  getBillList: {//type 0票据中心（查看已开应开详情） 1查询票据中心（查看已收应收详情）
    api: ({ currentPage = 1, type = 0, companyName = '' }) => `/supplychainfinance-audit/lookBoard/getBillData/${type === 0 ? 'payBill' : 'receivedBill'}?currentPage=${currentPage}&pageSize=20${companyName ? '&companyName=' + companyName : ''}`,
    type: 'GET'
  },
  // 监控中心接口
  getOrderCount: {
    api: () => '/supplychainfinance-audit/lookBoard/countWarning',
    type: 'GET'
  },
  getMonitorChart: {
    api: () => '/supplychainfinance-audit/lookBoard/countWarningCharts',
    type: 'GET'
  },
  // 利润、销售额度接口
  getAmountRank: {
    api: ({ type, current, companyName }) => type === 'profit' ? `/supplychainfinance-audit/lookBoard/getProfitDataRank?currentPage=${current}&pageSize=20${companyName ? `&companyName=${companyName}` : ''}`
      : `/supplychainfinance-audit/lookBoard/getSalesVolumeRank?currentPage=${current}&pageSize=20`,
    type: 'GET'
  },
  getAmountChart: {
    api: ({ type, companyName }) => type === 'profit' ? `/supplychainfinance-audit/lookBoard/getProfitDataColumn${companyName ? `?companyName=${companyName}` : ''}`
      : `/supplychainfinance-audit/lookBoard/getSalesVolumeColumn${companyName ? `?companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  // 风险敞口接口
  getRiskData: {
    api: ({ current, companyName }) =>
      `/supplychainfinance-audit/riskExposureInfo/getRiskExposurePage?currentPage=${current}&pageSize=20${companyName ? `&companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  getRiskChart: {
    api: (params) => {
      let url = '';
      Object.keys(params).forEach((key, i) => {
        if (i === 0) {
          url += `?${key}=${params[key]}`
        } else {
          url += `&${key}=${params[key]}`
        }
      })
      return `/supplychainfinance-audit/riskExposureInfo/getRiskExposure${url}`
    },
    type: 'GET'
  },
  //提交申请
  postApplication: {
    api: (businessMode = '0') => `/supplychainfinance-input/${businessMode === '0' ? 'entrustBuyApply'
      : businessMode === '1' ? 'entrustSaleApply' : businessMode === '2' ? 'financeStorageApply' : 'largeEntrustBuyApply'}/serviceApply`,
    type: 'POST'
  },

  // getReceivedBill: {//查询票据中心（查看已收应收详情）
  //   api: ({ currentPage = 1, pageSize = 20 }) => `/lookBoard/getBillData/receivedBill?currentPage=${currentPage}&pageSize=${pageSize}`,
  //   type: 'GET'
  // },

}
