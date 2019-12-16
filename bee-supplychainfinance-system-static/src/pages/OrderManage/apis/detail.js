export default {

  //获取订单信息
  getOrderInfo: {
    api: (applyId) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? '/buyOrder/getBuyOrderDetail' :
        sessionStorage.businessMode === '1' ? '/saleOrders/getSaleOrderDetail' :
          sessionStorage.businessMode === '2' ? '/storageOrders/getStorageOrderDetail' : '/largeBuyOrders/getLargeBuyOrderDetail'
      }?orderId=${applyId}`,
    type: "GET"
  },

  //获取销售子订单信息
  getChildOrderInfo: {
    api: (id) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '1' ? '/saleSubOrders/getSaleSubOrderDetail' : '/largeBuySubOrders/getLargeSubOrderDetail'
      }?orderId=${id}`,
    type: "GET"
  },

  //获取订单操作日志
  getLogs: {
    api: (url) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? '/buyOrdersOperateLog/getBuyOrderLog' :
        sessionStorage.businessMode === '1' ? '/saleOrdersOperateLog/getSaleOrderLog' :
          sessionStorage.businessMode === '2' ? '/storageOrdersOperateLog/getStorageOrderLog' : '/largeBuyOrdersOperateLog/getLargeBuyOrderLog'
      }?${url}`,
    type: "GET"
  },

  //获取委托销售发货单
  getInvoice: {
    api: (id) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '1' ? '/saleSubOrders/getSaleSubOrdersList' : '/largeBuySubOrders/getLargeBuySubOrdersList'
      }?orderId=${id}`,
    type: "GET"
  },

  // 保存业务名称
  saveModeName: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyOrder' :
        sessionStorage.businessMode === '1' ? 'saleOrders' :
          sessionStorage.businessMode === '2' ? 'storageOrders' : 'largeBuyOrders'
      }/saveOrderModeName`,
    type: 'POST'
  },

  // 查询审批结果
  getApprovalResult: {
    api: (id) => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyOrder' :
        sessionStorage.businessMode === '1' ? 'saleOrders' :
          sessionStorage.businessMode === '2' ? 'storageOrders' : 'largeBuyOrders'
      }/getRiskAuditMsg?orderId=${id}`,
    type: 'GET'
  }
};