
const typeChange = () => {
  const businessMode = Number(sessionStorage.businessMode)
  if (businessMode === 0) {
    return "buyLogisticsInfo"
  } else if (businessMode === 1) {
    return "saleLogisticsInfo"
  } else if (businessMode === 2){
    return "buyLogisticsInfo"
  } else {
    return "largeBuyLogisticsInfo"
  }
}
export default {
  getLogisticsInfo: {
    //查询物流信息  采购
    api: (params) => `/supplychainfinance-audit/${typeChange()}/getLogisticsInfoByOrderId?businessMode=${params.businessMode}&orderId=${params.orderId}`,
    type: "GET"
  },
  delLogisticsAccessory: {
    //删除附件信息
    api: (params) => `/supplychainfinance-audit/${typeChange()}/delLogisticsAccessoryById?accessId=${params.accessId}&orderId=${params.orderId}`,
    type: "GET"
  },
  getLogisticsLog: {
    //获取物流操作日志
    api: (orderId) => `/supplychainfinance-audit/${typeChange()}/getLogisticsLog?orderId=${orderId}`,
    type: "GET"
  },
  saveLogisticsInfo: {
    //保存物流信息  委托采购
    api: () => `/supplychainfinance-audit/${typeChange()}/saveLogisticsInfo`,
    type: "POST"
  },
  updateLogisticsInfo: {
    //更新物流信息  委托采购
    api:() => `/supplychainfinance-audit/${typeChange()}/updateLogisticsInfo`,
    type: "POST"
  }
}

