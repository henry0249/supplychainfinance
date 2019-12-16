
export default {
  getList: {//查询行业指数数值列表
    api: ({ indexFirstTypeId, indexSecondTypeId, currentPage = 1, pageSize = 10 }) =>
      `/supplychainfinance-data-entry/industryindex/attribute/queryList?page=${currentPage}&indexFirstTypeId=${indexFirstTypeId}&indexSecondTypeId=${indexSecondTypeId}&pageSize=${pageSize}`,
    type: 'GET'
  },
  uploadList: {
    api: () => `/supplychainfinance-data-entry/industryindex/attribute/update`,
    type: 'POST'
  },
  getUnits: {//获取单位
    api: () =>
      `/supplychainfinance-data-entry/industryindex/unit/select`,
    type: 'GET'
  },

  getEditList: {//查询行业指数数值列表
    api: ({ indexFirstTypeId, indexSecondTypeId, currentPage = 1, pageSize = 10 }) =>
      `/supplychainfinance-data-entry/industryindex/value/queryList?currentPage=${currentPage}&indexFirstTypeId=${indexFirstTypeId}&indexSecondTypeId=${indexSecondTypeId}&pageSize=${pageSize}&_t=${+new Date()}`,
    type: 'GET'
  },
  //更新行业指数数值
  updateEditList: {
    api: () =>
      `/supplychainfinance-data-entry/industryindex/value/update`,
    type: 'POST'
  },
  getChart: {//行业指数图表相关
    api: ({ key, startTime, endTime }) =>
      `/supplychainfinance-data-entry/industryindex/list?indexId=${key}&startTime=${startTime}&endTime=${endTime}`,
    type: 'GET'
  },
  getTree: {//查询展示面板表结构
    api: (indexFirstTypeId) =>
      `/supplychainfinance-data-entry/industryindex/structure/select?indexFirstTypeId=${indexFirstTypeId}`,
    type: 'GET'
  }


}

