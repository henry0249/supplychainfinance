export default {
  exportExcel: {
    api: (id, type) => `/supplychainfinance-audit/reportForm/exportReportsByCondition`,
    type: 'POST'
  }
}
