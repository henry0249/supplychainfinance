export default {
  getConstant: {
    api: () => `/supplychainfinance-data-entry/baseTopCompany/getConstant`,
    type: 'GET'
  },
  getYears: {
    api: () => `/supplychainfinance-data-entry/baseTopCompany/getYears`,
    type: 'GET'
  },
  getListByCondition: {
    api: ({ current, inland, years }) =>
      `/supplychainfinance-data-entry/baseTopCompany/getListByCondition?pageSize=10&currentPage=${current}${inland !== undefined ? `&inland=${inland}` : ''}${years ? `&years=${years}` : ''}`,
    type: 'GET'
  },
  getDataByName: {
    api: ({ current, companyName }) =>
      `/supplychainfinance-data-entry/baseTopCompany/getListByName?pageSize=10&currentPage=${current}${companyName ? `&companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  deleteData: {
    api: () => '/supplychainfinance-data-entry/baseTopCompany/delete',
    type: 'POST'
  },
  getDataById: {
    api: (id) => `/supplychainfinance-data-entry/baseTopCompany/getInfoById?id=${id}`,
    type: 'GET'
  },
  saveData: {
    api: () => '/supplychainfinance-data-entry/baseTopCompany/update',
    type: 'POST'
  }
}