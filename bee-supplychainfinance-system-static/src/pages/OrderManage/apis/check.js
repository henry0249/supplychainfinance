export default {
  // 确认开票证明
  confirmInvoice: {
    api: (id) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? '/buyInvoiceProof' :
        sessionStorage.businessMode === '1' ? '/saleInvoiceProof' :
          sessionStorage.businessMode === '2' ? '/storageInvoiceProof' : '/largeBuyInvoiceProof'
      }/confirmInvoiceProof`,
    type: "POST"
  },

  // 退回开票证明
  returnInvoice: {
    api: () => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? '/buyInvoiceProof' :
        sessionStorage.businessMode === '1' ? '/saleInvoiceProof' :
          sessionStorage.businessMode === '2' ? '/storageInvoiceProof' : '/largeBuyInvoiceProof'
      }/returnInvoiceProof`,
    type: "POST"
  },

  // 审核延期提货证明
  checkDelay: {
    api: () => `/supplychainfinance-audit/audit/${
      sessionStorage.businessMode === '0' ? 'buy' : 'storage'
      }/delay`, //销售没有延期提货
    type: "POST"
  },

  // 审核结算单
  checkSettlement: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyAccounts' :
        sessionStorage.businessMode === '1' ? 'saleAccounts' :
          sessionStorage.businessMode === '2' ? 'storageAccounts' : 'largeBuyAccounts'
      }/examine`,
    type: "POST"
  },

  // 审核提货申请
  checkGoods: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyPickUpApply' : 'storagePickUpApply'
      }/examine`, //销售没有
    type: "POST"
  },

  // 确认提货申请
  confirmGoods: {
    api: () => `/supplychainfinance-audit/storagePickUpApply/confirmPickUpApply`,
    type: "POST"//只有金融仓促需要确定提货
  },

  // 审核保证金证明
  checkBail: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyBondProof' :
        sessionStorage.businessMode === '1' ? 'saleBondProof' : 'largeBuyBondProof'
      }/examine`, //金融没有保证金
    type: "POST"
  },

  // 确认货权转移证明
  confirmTransfer: {
    api: () => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? '/buyGoodsPowerTransferProof' :
        sessionStorage.businessMode === '1' ? '/saleGoodsPowerTransferProof' : '/largeBuyGoodsPowerTransferProof'
      }/sure`, //金融没有货权
    type: "POST"
  },

  // 拒绝货权转移证明
  returnTransfer: {
    api: () => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? '/buyGoodsPowerTransferProof' :
        sessionStorage.businessMode === '1' ? '/saleGoodsPowerTransferProof' : '/largeBuyGoodsPowerTransferProof'
      }/refuse`, //金融没有货权
    type: "POST"
  },

  // 确认收款证明
  paymentSure: {
    api: () => `/supplychainfinance-audit${
      sessionStorage.businessMode === '1' ? '/salePaymentProof' : '/largeBuyPaymentProof'
      }/sure`,
    type: "POST" //采购、销售自动通过
  },

  // 拒绝收款证明
  paymentReturn: {
    api: () => `/supplychainfinance-audit${
      sessionStorage.businessMode === '1' ? '/salePaymentProof' : '/largeBuyPaymentProof'
      }/refuse`,
    type: "POST" //采购、销售自动通过
  },

  // 审核仓单
  checkStorage: {
    api: () => `/supplychainfinance-audit/storageStorehouseBillProof/examine`,
    type: "POST" //采购、销售没有
  },

  // 查看付款证明提交情况
  queryPay: {
    api: (id) => `/supplychainfinance-audit${
      sessionStorage.businessMode === '0' ? `/buyContractBasic/getContractStatusByOrderId?buyOrdersId=${id}&isPay=1` :
        `/largeBuyContractBasic/getContractStatusByOrderId?largeBuyOrdersId=${id}&isPay=1`
      }`,
    type: "GET"
  },
}