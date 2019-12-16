
export default {
  getEconomicData: {//宏观-获取不同tag页的经济增长数据
    api: ({ key, currentPage = 1, pageSize = 10 }) =>
      `/supplychainfinance-data-entry/macroEconomicGrowth/getEconomicData?currentPage=${currentPage}&key=${key}&pageSize=${pageSize}`,
    type: 'GET'
  },
  //宏观-经济增长相关数据编辑
  updateMacroEconomicGrowth: {
    api: (key) =>
      `/supplychainfinance-data-entry/macroEconomicGrowth/updateMacroEconomicGrowth?key=${key}`,
    type: 'POST'
  },
  getEconomicChart: {//宏观-宏观经济经济增长图表相关
    api: ({ key, startTime, endTime }) =>
      `/supplychainfinance-data-entry/macroEconomicGrowth/getEconomicChart?key=${key}&startTime=${startTime}&endTime=${endTime}`,
    type: 'GET'
  }

}


