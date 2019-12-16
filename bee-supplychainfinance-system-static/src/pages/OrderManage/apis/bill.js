export default {
  // 票据信息
  getInfo: {
    api: (id) => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyOrder' :
        sessionStorage.businessMode === '1' ? 'saleOrders' :
          sessionStorage.businessMode === '2' ? 'storageOrders' : 'largeBuyOrders'
      }/getBillAllTypes?orderBusinessId=${id}`,
    type: "GET"
  },

  // 获取被退回的票据信息
  getRefused: {
    api: (id) => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyOrder' :
        sessionStorage.businessMode === '1' ? 'saleOrders' :
          sessionStorage.businessMode === '2' ? 'storageOrders' : 'largeBuyOrders'
      }/getBillAllRefused?orderBusinessId=${id}`,
    type: 'GET'
  },

  // 票据操作日志
  getLogs: {
    api: (id) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? '/bill/logs?buyOrdersId' :
        sessionStorage.businessMode === '1' ? '/sale/bill/logs?ordersId' :
          sessionStorage.businessMode === '2' ? '/storage/bill/logs?storageAccountsId' : '/largeBuyBillOperateLog/getLogs?ordersId'
      }=${id}`,
    type: "GET"
  },

  // 子订单票据操作日志
  getChildLogs: {
    api: (id) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '1' ? '/saleSubOrdersOperateLog/saleSubOrdersLog' : '/largeBuySubOrdersOperateLog/listLargeBuySubOrderLog'
      }?orderId=${id}`,
    type: "GET"
  },

  // 提交货权转移证明
  submitTransfer: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buySubmitProof' :
        sessionStorage.businessMode === '1' ? 'saleSubmitProof' : 'largeBuySubmitProof'
      }/goodsPowerTransfer`, // 金融仓储没有
    type: "POST"
  },

  // 提交开票证明
  submitInvoice: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buySubmitProof' :
        sessionStorage.businessMode === '1' ? 'saleSubmitProof' :
          sessionStorage.businessMode === '2' ? 'storageSubmitProof' : 'largeBuySubmitProof'
      }/invoiceProof`,
    type: "POST"
  },

  // 提交保证金证明
  submitBail: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buySubmitProof' :
        sessionStorage.businessMode === '1' ? 'saleSubmitProof' : 'largeBuySubmitProof'
      }/bondProof`, // 金融仓储没有
    type: "POST"
  },

  // 提交延期提货证明
  submitDelay: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buySubmitProof' : 'storageSubmitProof'
      }/delayApply`, // 委托销售没有
    type: "POST"
  },

  // 提交提货证明
  submitGoods: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buySubmitProof' : 'storageSubmitProof'
      }/pickUpApply`, // 委托销售没有
    type: "POST"
  },

  // 提交付款证明
  submitPayment: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buySubmitProof' :
        sessionStorage.businessMode === '1' ? 'saleSubmitProof' :
          sessionStorage.businessMode === '2' ? 'storageSubmitProof' : 'largeBuySubmitProof'
      }/paymentProof`,
    type: "POST"
  },

  // 获取付款证明中企业列表
  getPaymentCom: {
    api: (id) => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyOrder' :
        sessionStorage.businessMode === '1' ? 'saleOrders' :
          sessionStorage.businessMode === '2' ? 'storageOrders' : 'largeBuyOrders'
      }/getPaymentCompany?orderId=${id}`,
    type: 'GET'
  },

  // 提交放货证明
  submitDelivery: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buySubmitProof' : 'storageSubmitProof'
      }/deliverGoodsProof`, // 委托销售没有
    type: "POST"
  },

  // 提交仓单证明
  submitWarehouse: {
    api: () => `/supplychainfinance-audit/storageSubmitProof/storehouseBill`, //只有金融仓储有
    type: "POST"
  },

  // 获取保证金审核记录
  getBailRecord: {
    api: (id) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? '/buyBondProof' : '/saleBondProof'
      }/record?bondId=${id}`, //只有采购、销售才有保证金审核
    type: "GET"
  },

  // 终止发货
  stopShip: {
    api: (id) => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '1' ? 'saleOrders' : 'largeBuyOrders'
      }/terminateDelivery?orderId=${id}`,
    type: "GET"
  },

  // 提交各种函
  submitLetter: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buySubmitProof' :
        sessionStorage.businessMode === '1' ? 'saleSubmitProof' : 'largeBuySubmitProof'
      }/submitLetter`,
    type: "POST"
  },
}