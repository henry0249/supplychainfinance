import { stringify } from 'qs'
import request from '@/utils/request'
import apis from '../apis'
import { queryString } from '@/utils/utils'

export async function getFlowChart(applyId) {
  return request(apis.getFlowChart.api(applyId), { method: 'GET' })
}

export async function getReport(params) {
  return request(apis.getReport.api(params.applyId), {
    method: apis.getReport.type
  })
}

export async function getEnclosure(applyId) {
  return request(apis.getEnclosure.api(applyId), { method: 'GET' })
}

export async function getOtherInfo(applyId) {
  return request(apis.getOtherInfo.api(applyId), { method: 'GET' })
}

export async function getProcessScheduleDetail(applyId) {
  return request(apis.getProcessScheduleDetail.api(applyId), { method: 'GET' })
}
export async function getCount(id) {
  return request(apis.getCount.api(id), {
    method: apis.getCount.type
  })
}
export async function getIsAudit(id) {
  return request(apis.getIsAudit.api(), {
    method: apis.getIsAudit.type,
    body: {
      applyId: id
    }
  })
}
export async function getScoreRisk(params) {
  //获取立项申请详情
  return request(apis.getScoreRisk.api(), {
    method: apis.getScoreRisk.type,
    body: params
  })
}

export async function updateRiskScore(params) {
  //更新风控评分
  return request(apis.updateRiskScore.api(), {
    method: apis.updateRiskScore.type,
    body: params
  })
}
export async function getScoreRiskMacroeconomic(params) {
  //获取立项申请详情
  return request(apis.getScoreRiskMacroeconomic.api(params.applyId), {
    method: apis.getScoreRiskMacroeconomic.type
  })
}

export async function getList(params) {
  return request(apis.getList.api(params.url), {
    method: apis.getList.type,
    body: params.params
  })
}
export async function getPriceTrend(params) {
  let str = 'sid=' + params.sid + '&'
  params.period.forEach((item, index) => {
    if (index !== 0) {
      str += '&period=' + item
    } else {
      str += 'period=' + item
    }
  })
  return request(apis.getPriceTrend.api(str), {
    method: apis.getPriceTrend.type
  })
}

export async function getProcessSchedule() {
  return request(apis.getProcessSchedule.api(), {})
}

//决策委员会退回
export async function refuse(params) {
  return request(apis.refuse.api(params), {
    method: apis.refuse.type,
    body: params
  })
}

export async function getLogs(params) {
  return request(apis.getLogs.api(params.applyId), {
    method: apis.getLogs.type,
    body: params
  })
}

export async function queryBackRole(params) {
  return request(apis.queryBackRole.api(), {
    method: apis.queryBackRole.type,
    body: params
  })
}

export async function submitBack(params) {
  return request(apis.submitBack.api(), {
    method: apis.submitBack.type,
    body: params
  })
}

export async function agree(id) {
  return request(apis.agree.api(id), {
    method: apis.agree.type
  })
}

export async function agreeApproval(params) {
  return request(apis.agreeApproval.api(), {
    method: apis.agreeApproval.type,
    body: params
  })
}

export async function getRiskFactor(applyId) {
  return request(apis.getRiskFactor.api(applyId), {
    method: apis.getRiskFactor.type
  })
}

export async function getAuditMsg(applyId) {
  return request(apis.getAuditMsg.api(applyId), {
    method: apis.getAuditMsg.type
  })
}

export async function addRiskFactor(params) {
  return request(apis.addRiskFactor.api(), {
    method: apis.addRiskFactor.type,
    body: params
  })
}

export async function getBuyDetail(params) {
  return request(apis.entrustBuyDetailBuy.api(params), {
    method: apis.entrustBuyDetailBuy.type
  })
}
export async function getLargeBuyDetail(params) {
  return request(apis.largeEntrustBuyDetail.api(params), {
    method: apis.largeEntrustBuyDetail.type
  })
}
export async function getSaleDetail(params) {
  return request(apis.entrustSaleDetailSale.api(params), {
    method: apis.entrustSaleDetailSale.type
  })
}
export async function getStorageDetail(params) {
  return request(apis.financeStorageDetail.api(params), {
    method: apis.financeStorageDetail.type
  })
}
