export default {
  // 获取结算单信息
  getInfo: {
    api: (id) => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyAccounts/getBuyAccountInfo' :
        sessionStorage.businessMode === '1' ? 'saleAccounts/getSaleAccountInfo' :
          sessionStorage.businessMode === '2' ? 'storageAccounts/getStorageAccountInfo' : 'largeBuyAccounts/getLargeBuyAccountInfo'
      }?${sessionStorage.businessMode === '4' ? 'subOrderId' : 'orderId'}=${id}`,
    type: "GET"
  },
  // 获取结算单结算情况
  getsituation: {
    api: (url) => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyAccounts/checkAccountConfirmStatus' :
        sessionStorage.businessMode === '1' ? 'saleAccounts/checkAccountConfirmStatus' :
          sessionStorage.businessMode === '2' ? 'storageAccounts/checkAccountConfirmStatus' : 'largeBuyAccounts/largeBuyCheckAccountConfirmStatus'
      }?${url}`,
    type: "GET"
  },
  // 确认结算单
  confirm: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyAccounts/confirmAccount' :
        sessionStorage.businessMode === '1' ? 'saleAccounts/confirmAccount' :
          sessionStorage.businessMode === '2' ? 'storageAccounts/confirmAccount' : 'largeBuyAccounts/largeBuyConfirmAccount'
      }`,
    type: "POST"
  },
  // 保存结算单
  save: {
    api: () => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyAccounts/saveBuyAccountInfo' :
        sessionStorage.businessMode === '1' ? 'saleAccounts/saveSaleAccountInfo' :
          sessionStorage.businessMode === '2' ? 'storageAccounts/saveStorageAccountInfo' : 'largeBuyAccounts/saveLargeBuyAccountInfo'
      }`,
    type: "POST"
  },
  // 获取退回结算
  getRefused: {
    api: (id) => `/supplychainfinance-audit/${
      sessionStorage.businessMode === '0' ? 'buyAccounts' :
        sessionStorage.businessMode === '1' ? 'saleAccounts' :
          sessionStorage.businessMode === '2' ? 'storageAccounts' : 'largeBuyAccounts'
      }/getRefused?orderBusinessId=${id}`,
    type: "GET"
  }
}