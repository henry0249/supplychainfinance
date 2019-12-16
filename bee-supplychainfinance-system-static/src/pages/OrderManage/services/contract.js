import request from '@/utils/request';
import apis  from '../apis/contract'

//订单合同
  //合同管理 获取所有合同
  export async function getAllContract(params) {
    return request(apis.getContractsForManagement.api(params), {
      method: apis.getContractsForManagement.type
    });
  }
  //合同新建或编辑（基础信息）
  export async function newContract(params) {
    return request(apis.createContract.api(params), {
      method: apis.createContract.type,
      body:params
    });
  }
  //合同删除（基础信息）
  export async function removeContract(params) {
    return request(apis.deleteContract.api(params), {
      method: apis.deleteContract.type,
      body:params
    });
  }
  //已签订合同相关接口
  //已签订合同列表
  export async function getSignedContract(params) {
    return request(apis.getContractsSigned.api(params), {
      method: apis.getContractsSigned.type
    });
  }
  //已签订合同删除
  export async function removeSignedContract(params) {
    return request(apis.deleteContractSigned.api(params), {
      method: apis.deleteContractSigned.type,
      body:params
    });
  }
  //已签订合同保存
  export async function saveSignedContract(params) {
    return request(apis.saveContractSigned.api(params), {
      method: apis.saveContractSigned.type,
      body:params
    });
  }

  //合同日志相关接口
  //根据订单业务id查询合同相关日志信息
  export async function getLog(params) {
    return request(apis.getContractLogInfo.api(params), {
      method: apis.getContractLogInfo.type
    });
  }
//查看合同确认情况
export async function getContractStatus(params) {
    return request(apis.checkContractConfirmStatus.api(params), {
      method: apis.checkContractConfirmStatus.type
    });
}
//合同详情获取（合同word）
export async function getContract(params) {
    return request(apis.getContractDetail.api(params), {
      method: apis.getContractDetail.type
    });
}
//确认合同
export async function sureContract(params) {
    return request(apis.confirmContract.api(params), {
      method: apis.confirmContract.type,
      body:params
    });
}
//合同详情修改合同word文件
export async function uploadContract(params) {
    return request(apis.updateContractURL.api(params), {
      method: apis.updateContractURL.type,
      body:params
    });
}
// 通用文件上传（将word转为pdf保存）
export async function uploadWordContract(params) {
    return request(apis.uploadWordFile.api(params), {
      method: apis.uploadWordFile.type,
      body:params
    });
}