
const getType = () => window.g_app._store.getState().projectApproval.currentType;
export default {

  getSteps: {//获取业务进度
    api: (params) => {
      if (params.businessMode === 0) {
        return `/supplychainfinance-audit/buyOrder/getOrderProcessNode?orderId=${params.id}`
      } else if (params.businessMode === 1) {
        return `/supplychainfinance-audit/saleOrders/getOrderProcessNode?orderId=${params.id}`
      } else if (params.businessMode === 2) {
        return `/supplychainfinance-audit/storageOrders/getOrderProcessNode?orderId=${params.id}`
      } else {
        return `/supplychainfinance-audit/largeBuyOrders/getOrderProcessNode?orderId=${params.id}`
      }
    },
    type: "GET"
  },

  getWarningList: {//查询预警信息列表
    api: (url) => `/supplychainfinance-audit/earlyWariningRecord/getWariningRecordByOrderId?${url}`,
    type: "GET"
  },

  getLogs: {//获取预警操作日志
    api: (url) => `/supplychainfinance-audit/earlyWariningRecord/getLogsByOrderId?${url}`,
    type: "GET"
  },

  addWarning: {//增加预警
    api: () => `/supplychainfinance-audit/earlyWariningRecord/addWariningRecord`,
    type: "POST"
  },

  handleWarning: {//预警处理
    api: () => `/supplychainfinance-audit/buyOrderManege/getBuyOrdersList`,
    type: "POST"
  },

};
