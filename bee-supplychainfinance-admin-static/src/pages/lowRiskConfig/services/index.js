import request from "@/common/request";
import api from '../apis';

export async function getList(params={},currentPage,pageSize) {
  return request(api.getList.api(params.businessMode, params.subjectName,currentPage,pageSize));
}

export async function saveLowRiskConfig(params) {
  return request(api.saveLowRiskConfig.api(), {
    method: api.saveLowRiskConfig.type,
    body: params
  });
}

export async function deleteLowRiskConfig(params={id:''}) {
  return request(api.deleteLowRiskConfig.api(params.id), {
    method: api.deleteLowRiskConfig.type,
    body: params
  });
}

export async function getSysCodeInfo(params) {
  return request(api.getSysCodeInfo.api(params), {
    method: api.getSysCodeInfo.type,
  });
}

