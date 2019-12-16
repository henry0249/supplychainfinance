
const getType = ()=>sessionStorage.businessMode

export default {
  //订单合同
  //合同管理 获取所有合同
  getContractsForManagement: {
    api: params =>
      `/supplychainfinance-audit/${
        getType() === "0"
          ? "buyContractBasic"
          : getType() === "1"
          ? "saleContractBasic"
          : getType() === "2"?"storageContractBasic" :"largeBuyContractBasic"
      }/getContractsForManagement?${
        getType() === "0" 
          ? "buyOrdersId"
          : getType() === "1"
          ? "saleOrdersId"
          : getType() === "2"?"storageOrdersId" :"largeBuyOrdersId"
      }=${params.buyOrdersId}`,
    type: "GET"
  },
  //合同新建或编辑（基础信息）
  createContract: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractBasic"
          : getType() === "1"
          ? "saleContractBasic"
          : getType() === "2"?"storageContractBasic" :"largeBuyContractBasic"
      }/createContract`,
    type: "POST"
  },
  //合同删除（基础信息）
  deleteContract: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractBasic"
          : getType() === "1"
          ? "saleContractBasic"
          : getType() === "2"?"storageContractBasic" :"largeBuyContractBasic"
      }/deleteContract`,
    type: "POST"
  },

  //已签订合同相关接口
  //已签订合同列表
  getContractsSigned: {
    api: params =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractAttachment"
          : getType() === "1"
          ? "saleContractAttachment"
          : getType() === "2"?"storageContractAttachment" :"largeBuyContractAttachment"
      }/getContractsSigned?${
        getType() === "0"
          ? "buyOrdersId"
          : getType() === "1"
          ? "saleOrdersId"
          : getType() === "2"?"storageOrdersId" :"largeBuyOrdersId"
      }=${params.buyOrdersId}`,
    type: "GET"
  },
  //已签订合同删除
  deleteContractSigned: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractAttachment"
          : getType() === "1"
          ? "saleContractAttachment"
          : getType() === "2"?"storageContractAttachment" :"largeBuyContractAttachment"
      }/deleteContractSigned`,
    type: "POST"
  },
  //已签订合同保存
  saveContractSigned: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractAttachment"
          : getType() === "1"
          ? "saleContractAttachment"
          : getType() === "2"?"storageContractAttachment" :"largeBuyContractAttachment"
      }/saveContractSigned`,
    type: "POST"
  },

  //合同日志相关接口
  //根据订单业务id查询合同相关日志信息
  getContractLogInfo: {
    api: params =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractLog"
          : getType() === "1"
          ? "saleContractLog"
          : getType() === "2"?"storageContractLog" :"largeBuyContractLog"
      }/getContractLogInfo?orderId=${params.orderId}`,
    type: "GET"
  },

  //合同详情API
  //查看合同确认情况
  checkContractConfirmStatus: {
    api: params =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractBasic"
          : getType() === "1"
          ? "saleContractBasic"
          : getType() === "2"?"storageContractBasic" :"largeBuyContractBasic"
      }/checkContractConfirmStatus?${
        getType() === "0"
          ? "buyContractBasicId"
          : getType() === "1"
          ? "saleContractBasicId"
          : getType() === "2"?"storageContractBasicId" :"largeBuyContractBasicId"
      }=${params.buyContractBasicId}&userCompanyName=${
        params.userCompanyName
      }&roleId=${params.roleId}`,
    type: "GET"
  },
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
          :getType() === "2"?"storageContractBasicId" :"largeBuyContractBasicId"
      }=${params.buyContractBasicId}&${
        getType() === "0"
          ? "buyOrdersId"
          : getType() === "1"
          ? "saleOrdersId"
          : getType() === "2"?"storageOrdersId" :"largeBuyOrdersId"
      }=${params.buyOrdersId}`,
    type: "GET"
  },
  //确认合同
  confirmContract: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractBasic"
          : getType() === "1"
          ? "saleContractBasic"
          : getType() === "2"?"storageContractBasic" :"largeBuyContractBasic"
      }/confirmContract`,
    type: "POST"
  },
  //合同详情修改合同word文件
  updateContractURL: {
    api: () =>
      `/supplychainfinance-audit/${
        getType() === "0" 
          ? "buyContractBasic"
          : getType() === "1"
          ? "saleContractBasic"
          : getType() === "2"?"storageContractBasic" :"largeBuyContractBasic"
      }/updateContractURL`,
    type: "POST"
  },
};
