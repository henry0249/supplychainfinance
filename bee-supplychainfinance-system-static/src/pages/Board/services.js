import request from '@/utils/request';
import api from "./api"

export function getBoard(params) {
  return request(api.getBoard.api(), {
    method: api.getBoard.type
  })
}

//获取企业资金占比数据
export function getSettlementMoneyChart(params) {
  return request(api.getSettlementMoneyChart.api(params), {
    method: api.getSettlementMoneyChart.type
  })
}
// 获取财务管理图标数据
export function getFinancialChart(params) {
  return request(api.getFinancialChart.api(params))
}
// 获取财务信息4个数值
export function getFinancialData(params) {
  return request(api.getFinancialData.api(params))
}
// 获取财务中心付款、收款列表
export function getListInfo(params) {
  return request(api.getListInfo.api(params))
}

export function getInvoice(params) {
  return request(api.getInvoice.api(params))
}

export function getBillData(params) {
  return request(api.getBillData.api(params))
}

export function getPayBill(params) {
  return request(api.getPayBill.api(params))
}

export function getBillList(params) {
  return request(api.getBillList.api(params))
}

// 获取监控中心当日订单统计
export function getOrderCount() {
  return request(api.getOrderCount.api())
}

// 获取监控中心图表数据
export function getMonitorChart() {
  return request(api.getMonitorChart.api())
}

// 获取闭卷业务额度排行列表
export function getAmountRank(params) {
  return request(api.getAmountRank.api(params))
}

// 获取闭卷业务额度图表数据
export function getAmountChart(params) {
  return request(api.getAmountChart.api(params))
}

// 获取风险敞口列表
export function getRiskData(params) {
  return request(api.getRiskData.api(params))
}

// 获取风险敞口图表数据
export function getRiskChart(params) {
  return request(api.getRiskChart.api(params))
}

export function postApplication(params) {
  return request(api.postApplication.api(params.businessMode), { method: api.postApplication.type, body: params.body })
}
