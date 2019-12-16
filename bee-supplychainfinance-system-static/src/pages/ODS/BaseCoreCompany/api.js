export default {
  getDataByType: {
    api: ({ current, roleType }) =>
      `/supplychainfinance-data-entry/baseCoreCompany/getListByType?pageSize=10&currentPage=${current}&roleType=${roleType}`,
    type: 'GET'
  },
  getDataByName: {
    api: ({ current, companyName }) =>
      `/supplychainfinance-data-entry/baseCoreCompany/getListByName?pageSize=10&currentPage=${current}${companyName ? `&companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  deleteData: {
    api: () => '/supplychainfinance-data-entry/baseCoreCompany/delete',
    type: 'POST'
  },
  getDataById: {
    api: (id) => `/supplychainfinance-data-entry/baseCoreCompany/getInfoById?id=${id}`,
    type: 'GET'
  },
  getList: {
    api: () => '/supplychainfinance-common/companyBase/getCompanyBaseInfo',
    type: 'GET'
  },
  saveData: {
    api: () => '/supplychainfinance-data-entry/baseCoreCompany/update',
    type: 'POST'
  }
}