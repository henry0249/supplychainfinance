
const getType = () => window.g_app._store.getState().projectApproval.currentType;
export default {
  
  getCounts: {//获取订单管理首页数量统计
    api: (applyId) =>`/supplychainfinance-audit/orderManege/getOrdersStatusCount`,
    type: "get"
  },

  getList: {//查询列表数据
    api: (url) => `/supplychainfinance-audit/orderManege/getOrdersList?${url}`,
    type: "POST"
  },

};
