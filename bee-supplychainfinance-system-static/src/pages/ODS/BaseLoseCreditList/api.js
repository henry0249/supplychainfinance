export default {
  getAllProvince: {
    api: () => '/supplychainfinance-input/region/findRegionByParentId?pid=1',
    type: 'GET'
  },
  getDataByProvince: {
    api: ({ current, province }) =>
      `/supplychainfinance-data-entry/baseLoseCreditList/getListByProvince?pageSize=10&currentPage=${current}${province ? `&province=${province}` : ''}`,
    type: 'GET'
  },
  getDataByName: {
    api: ({ current, companyName }) =>
      `/supplychainfinance-data-entry/baseLoseCreditList/getListByName?pageSize=10&currentPage=${current}${companyName ? `&companyName=${companyName}` : ''}`,
    type: 'GET'
  },
  deleteData: {
    api: () => '/supplychainfinance-data-entry/baseLoseCreditList/delete',
    type: 'POST'
  },
  getDataById: {
    api: (id) => `/supplychainfinance-data-entry/baseLoseCreditList/getInfoById?id=${id}`,
    type: 'GET'
  },
  saveData: {
    api: () => '/supplychainfinance-data-entry/baseLoseCreditList/update',
    type: 'POST'
  }
}