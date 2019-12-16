import request from '@/utils/request';
import apis from '../apis/bill';

// 获取票据
export async function getInfo(id) {
  return request(apis.getInfo.api(id));
}

// 获取退回的票据信息
export async function getRefused(id) {
  return request(apis.getRefused.api(id));
}

// 获取票据操作日志
export async function getLogs(id) {
  return request(apis.getLogs.api(id))
}

// 获取票据操作日志
export async function getChildLogs(id) {
  return request(apis.getChildLogs.api(id))
}

// 提交货权转移证明
export async function submitTransfer(params) {
  return request(apis.submitTransfer.api(), {
    method: apis.submitTransfer.type,
    body: params
  })
}

// 提交开票证明
export async function submitInvoice(params) {
  return request(apis.submitInvoice.api(), {
    method: apis.submitInvoice.type,
    body: params
  })
}

// 提交保证金证明
export async function submitBail(params) {
  return request(apis.submitBail.api(), {
    method: apis.submitBail.type,
    body: params
  })
}

// 提交延期提货证明
export async function submitDelay(params) {
  return request(apis.submitDelay.api(), {
    method: apis.submitDelay.type,
    body: params
  })
}

// 提交提货证明
export async function submitGoods(params) {
  return request(apis.submitGoods.api(), {
    method: apis.submitGoods.type,
    body: params
  })
}

// 提交付款证明
export async function submitPayment(params) {
  return request(apis.submitPayment.api(), {
    method: apis.submitPayment.type,
    body: params
  })
}

// 获取付款证明中企业列表
export async function getPaymentCom(id) {
  return request(apis.getPaymentCom.api(id))
}


// 提交放货证明
export async function submitDelivery(params) {
  return request(apis.submitDelivery.api(), {
    method: apis.submitDelivery.type,
    body: params
  })
}

// 提交仓单证明
export async function submitWarehouse(params) {
  return request(apis.submitWarehouse.api(), {
    method: apis.submitWarehouse.type,
    body: params
  })
}

// 获取保证金审核记录
export async function getBailRecord(id) {
  return request(apis.getBailRecord.api(id))
}

// 终止发货
export async function stopShip(id) {
  return request(apis.stopShip.api(id))
}

// 提交函
export async function submitLetter(params) {
  return request(apis.submitLetter.api(), {
    method: apis.submitLetter.type,
    body: params
  })
}