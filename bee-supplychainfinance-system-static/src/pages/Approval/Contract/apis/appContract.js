
const getType = () => sessionStorage.businessMode;

export default {
  //合同详情获取（合同word）
  getContractDetail: {
    api: params =>
      `/supplychainfinance-audit/${
        getType() === "0"
          ? "buyContractBasic"
          : getType() === "1"
          ? "saleContractBasic"
          : getType() === "2"?"storageContractBasic" :"largeBuyContractBasic"
      }/getContractDetail?${
        getType() === "0"
          ? "buyContractBasicId"
          : getType() === "1"
          ? "saleContractBasicId"
          : getType() === "2"?"storageContractBasicId" :"largeBuyContractBasicId"
      }=${params.buyContractBasicId}&${
        getType() === "0"
          ? "buyOrdersId"
          : getType() === "1"
          ? "saleOrdersId"
          : getType() === "2"?"storageOrdersId" :"largeBuyOrdersId"
      }=${params.buyOrdersId}`,
    type: "GET"
  },
  //退回合同流程
  repulseProcess: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0"
          ? "buyContractExamine"
          : getType() === "1"
          ? "saleContractExamine"
          : getType() === "2"?"storageContractExamine" :"largeBuyContractExamine"
      }/repulseProcess`,
    type: "POST"
  },
  //提交合同流程
  submitProcess: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0"
          ? "buyContractExamine"
          : getType() === "1"
          ? "saleContractExamine"
          : getType() === "2"?"storageContractExamine" :"largeBuyContractExamine"
      }/submitProcess`,
    type: "POST"
  },
  //根据订单业务id获取委托采购风控预警配置信息
  getWariningConfig: {
    api: params =>
      `/supplychainfinance-audit/${
        getType() === "0"
          ? "buyWariningConfig"
          : getType() === "1"
          ? "saleEarlyWariningConfig"
          : getType() === "2"?"storageEarlyWariningConfig" : "largeBuyWariningConfig"
      }/getWariningConfig?orderId=${params.orderId}`,
    type: "GET"
  },
  //保存委托采购风控预警配置信息
  saveWariningConfig: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0"
          ? "buyWariningConfig"
          : getType() === "1"
          ? "saleEarlyWariningConfig"
          : getType() === "2"?"storageEarlyWariningConfig" : "largeBuyWariningConfig"
      }/saveWariningConfig`,
    type: "POST"
  },
  //更新委托采购风控预警配置信息
  updateWariningConfig: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0"
          ? "buyWariningConfig"
          : getType() === "1"
          ? "saleEarlyWariningConfig"
          : getType() === "2"?"storageEarlyWariningConfig" : "largeBuyWariningConfig"
      }/updateWariningConfig`,
    type: "POST"
  },
  //根据申请单id查询单价和质量标准信息
  getChangeDetail: {
    api: (orderId) =>
      `/supplychainfinance-audit/contractAudit/getChangeDetail?orderId=${orderId}&businessMode=${getType()}`,
    type: "GET"
  },
  //修改相关数据并返回结果
  updateDataByLowGrade: {
    api: () =>
      `/supplychainfinance-audit/contractAudit/updateDataByLowGrade`,
    type: "POST"
  }
};
