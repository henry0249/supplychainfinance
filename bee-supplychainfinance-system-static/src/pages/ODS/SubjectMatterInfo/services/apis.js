
export default {
  getBigTypeInfo: {//获取标的物大类tab信息
    api: () =>
      `/supplychainfinance-data-entry/subjectMatterInfo/getBigTypeInfoChart`,
    type: 'GET'
  },
  getChartList: {//根据标的物大类查询标的物图表信息
    api: (typeName) =>
      `/supplychainfinance-data-entry/subjectMatterInfo/getChartList?typeName=${typeName}`,
    type: 'GET'
  },
  getChartInfo: {//根据标的物id查询标的物图表信息
    api: ({ key, startTime, endTime }) =>
      `/supplychainfinance-data-entry/subjectMatterInfo/getChartInfo?id=${key}&startTime=${startTime}&endTime=${endTime}`,
    type: 'GET'
  }

}


