import request from '@/utils/request';
import apis  from '../apis/appContract'

//合同详情获取（合同word）
export async function getContract(params) {
  return request(apis.getContractDetail.api(params), {
    method: apis.getContractDetail.type
  });
}
//退回合同流程
export async function refuseContract(params) {
  return request(apis.repulseProcess.api(params), {
    method: apis.repulseProcess.type,
    body:params
  });
}
//提交合同流程
export async function submitContract(params) {
  return request(apis.submitProcess.api(params), {
    method: apis.submitProcess.type,
    body:params
  });
}
//根据订单业务id获取委托采购风控预警配置信息
export async function getWarnings(params) {
  return request(apis.getWariningConfig.api(params), {
    method: apis.getWariningConfig.type
  });
}
//保存委托采购风控预警配置信息
export async function saveWarnings(params) {
  return request(apis.saveWariningConfig.api(params), {
    method: apis.saveWariningConfig.type,
    body:params
  });
}
//更新委托采购风控预警配置信息
export async function updateWarnings(params) {
  return request(apis.updateWariningConfig.api(params), {
    method: apis.updateWariningConfig.type,
    body:params
  });
}
//根据申请单id查询单价和质量标准信息
export async function getChangeThings(applyId) {
  return request(apis.getChangeDetail.api(applyId), {
    method: apis.getChangeDetail.type
  });
}
//修改相关数据并返回结果
export async function updateLowGrade(params) {
  return request(apis.updateDataByLowGrade.api(params), {
    method: apis.updateDataByLowGrade.type,
    body:params
  });
}