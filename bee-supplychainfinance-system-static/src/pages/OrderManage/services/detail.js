import request from '@/utils/request';
import apis from '../apis/detail';

//获取订单信息
export async function getOrderInfo(id) {
  return request(apis.getOrderInfo.api(id));
}

//获取销售子订单信息
export async function getChildOrderInfo(id) {
  return request(apis.getChildOrderInfo.api(id));
}

//获取操作日志
export async function getLogs(params) {
  return request(apis.getLogs.api(params.url));
}

//获取发货单
export async function getInvoice(id) {
  return request(apis.getInvoice.api(id));
}

//保存业务名称
export async function saveModeName(params) {
  return request(apis.saveModeName.api(), {
    method: apis.saveModeName.type,
    body: params
  });
}

//获取审批结果
export async function getApprovalResult(id) {
  return request(apis.getApprovalResult.api(id));
}