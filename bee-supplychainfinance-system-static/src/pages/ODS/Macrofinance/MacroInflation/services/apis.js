
export default {
  getMacroInflationList: {//宏观-通货膨胀相关数据列表获取
    api: ({ key, currentPage = 1, pageSize = 10 }) =>
      `/supplychainfinance-data-entry/macroInflation/getMacroInflationList?currentPage=${currentPage}&key=${key}&pageSize=${pageSize}`,
    type: 'GET'
  },
  //宏观-通货膨胀相关数据编辑
  updateMacroInflation: {
    api: (key) =>
      `/supplychainfinance-data-entry/macroInflation/updateMacroInflation?key=${key}`,
    type: 'POST'
  },
  getMacroInflationChart: {//宏观-通货膨胀图表相关
    api: ({ key, startTime, endTime }) =>
      `/supplychainfinance-data-entry/macroInflation/getMacroInflationChart?key=${key}&startTime=${startTime}&endTime=${endTime}`,
    type: 'GET'
  }
}

