
export default {
  //获取tags类型
  getTagTypes: {
    api: () =>
      `/supplychainfinance-data-entry/tags/getTagTypes`,
    type: 'GET'
  },
  //获取tags类型
  getTabs: {
    api: (type) =>
      `/supplychainfinance-data-entry/tags/buildTags?type=${type}`,
    type: 'GET'
  }
}
