import request from '@/utils/request';
import apis from '../apis/check';

// 确认开票证明
export async function confirmInvoice(params) {
  return request(apis.confirmInvoice.api(), {
    method: apis.confirmInvoice.type,
    body: params
  })
}
// 退回开票证明
export async function returnInvoice(params) {
  return request(apis.returnInvoice.api(), {
    method: apis.returnInvoice.type,
    body: params
  })
}

// 审核延期提货证明
export async function checkDelay(params) {
  return request(apis.checkDelay.api(), {
    method: apis.checkDelay.type,
    body: params
  })
}

// 审核结算单
export async function checkSettlement(params) {
  return request(apis.checkSettlement.api(), {
    method: apis.checkSettlement.type,
    body: params
  })
}

// 审核提货申请
export async function checkGoods(params) {
  return request(apis.checkGoods.api(), {
    method: apis.checkGoods.type,
    body: params
  })
}
// 确认提货申请
export async function confirmGoods(params) {
  return request(apis.confirmGoods.api(), {
    method: apis.confirmGoods.type,
    body: params
  })
}

// 审核保证金
export async function checkBail(params) {
  return request(apis.checkBail.api(), {
    method: apis.checkBail.type,
    body: params
  })
}

// 确认货权转移证明
export async function confirmTransfer(id) {
  return request(apis.confirmTransfer.api(id), {
    method: apis.confirmTransfer.type,
    body: id
  })
}
// 退回货权转移证明
export async function returnTransfer(params) {
  return request(apis.returnTransfer.api(params), {
    method: apis.returnTransfer.type,
    body: params
  })
}

// 确认收款证明
export async function paymentSure(id) {
  return request(apis.paymentSure.api(id), {
    method: apis.paymentSure.type,
    body: id
  })
}
// 退回收款证明
export async function paymentReturn(params) {
  return request(apis.paymentReturn.api(params), {
    method: apis.paymentReturn.type,
    body: params
  })
}

// 审核仓单
export async function checkStorage(params) {
  return request(apis.checkStorage.api(params), {
    method: apis.checkStorage.type,
    body: params
  })
}

// 查看付款证明提交情况
export async function queryPay(id) {
  return request(apis.queryPay.api(id))
}