
export default {
  getMacroResult: {// 获取宏观经济指标（经济增长、通货膨胀面板）
    api: ({ key, currentPage = 1, pageSize = 10 }) =>
      `/supplychainfinance-data-entry/macroIndex/getMacroResult`,
    type: 'GET'
  },
  //根据点击条件获取图表数据
  getResultByDateType: {
    api: ({ indexType, dateType }) =>
      `/supplychainfinance-data-entry/macroIndex/getResultByDateType?indexType=${indexType}&key=${dateType}`,
    type: 'GET'
  },
  //根据下拉框选择开始结束时间条件获取图表数据
  getResultByBeginEnd: {
    api: (indexType) =>
      `/supplychainfinance-data-entry/macroIndex/getResultByBeginEnd?indexType=${indexType}`,
    type: 'POST'
  },
  //获取宏观经济综合指数查询开始结束时间
  getBeginEndDate: {
    api: ({ key, indexType }) =>
      `/supplychainfinance-data-entry/macroIndex/getBeginEndDate`,
    type: 'GET'
  },
  //获取可点击的时间条件
  getDateTypes: {
    api: ({ key, indexType }) =>
      `/supplychainfinance-data-entry/macroIndex/getDateTypes`,
    type: 'GET'
  },
}
