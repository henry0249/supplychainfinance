export default {
  getDataByName: {
    api: ({ current, companyName }) =>
      `/supplychainfinance-data-entry/basePublicCompany/getListByName?pageSize=10&currentPage=${current}${companyName ? `&companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  deleteData: {
    api: () => '/supplychainfinance-data-entry/basePublicCompany/delete',
    type: 'POST'
  },
  getDataById: {
    api: (id) => `/supplychainfinance-data-entry/basePublicCompany/getInfoById?id=${id}`,
    type: 'GET'
  },
  saveData: {
    api: () => '/supplychainfinance-data-entry/basePublicCompany/update',
    type: 'POST'
  }
}