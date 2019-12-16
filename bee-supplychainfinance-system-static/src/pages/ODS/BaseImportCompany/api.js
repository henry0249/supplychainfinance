export default {
  getDataByType: {
    api: ({ current, companyType }) =>
      `/supplychainfinance-data-entry/baseImportCompany/getListByType?pageSize=10&currentPage=${current}&companyType=${companyType}`,
    type: 'GET'
  },
  getDataByName: {
    api: ({ current, companyName }) =>
      `/supplychainfinance-data-entry/baseImportCompany/getListByName?pageSize=10&currentPage=${current}${companyName ? `&companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  deleteData: {
    api: () => '/supplychainfinance-data-entry/baseImportCompany/delete',
    type: 'POST'
  },
  getDataById: {
    api: (id) => `/supplychainfinance-data-entry/baseImportCompany/getInfoById?id=${id}`,
    type: 'GET'
  },
  saveData: {
    api: () => '/supplychainfinance-data-entry/baseImportCompany/update',
    type: 'POST'
  }
}