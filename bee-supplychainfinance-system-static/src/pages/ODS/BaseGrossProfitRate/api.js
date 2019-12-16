export default {
  // 模糊查询列表
  getBaseGrossProfitRate: {
    api: ({ current, sourceName }) =>
      `/supplychainfinance-data-entry/baseGrossProfitRate/getListByName?pageSize=10&currentPage=${current}${sourceName ? `&sourceName=${sourceName}` : ''}`,
    type: 'GET'
  },
  // 删除原始
  deleteBaseGrossProfitRate: {
    api: () => '/supplychainfinance-data-entry/baseGrossProfitRate/delete',
    type: 'POST'
  },
  getList: {
    api: () => '/supplychainfinance-common/subjectMatter/getSubjectMatterList',
    type: 'GET'
  },
  saveBaseGrossProfitRate: {
    api: () => '/supplychainfinance-data-entry/baseGrossProfitRate/update',
    type: 'POST'
  },
  queryBySourceName: {
    api: (name) => `/supplychainfinance-data-entry/baseGrossProfitRate/getInfoByName?sourceName=${name}`,
    type: 'GET'
  }
}