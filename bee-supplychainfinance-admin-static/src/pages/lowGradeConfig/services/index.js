import request from "@/common/request";
import api from '../apis';

export async function getList(params={},currentPage,pageSize) {
  return request(api.getList.api(params.businessMode, params.subjectName,currentPage,pageSize));
}

export async function findUpdateCloumns(businessMode) {
  return request(api.findUpdateCloumns.api(businessMode), {
    method: api.findUpdateCloumns.type,
  });
}

export async function getTriggerType(businessMode) {
  return request(api.getTriggerType.api(businessMode), {
    method: api.getTriggerType.type,
  });
}

export async function findLowGradeConfig(id) {
  return request(api.findLowGradeConfig.api(id), {
    method: api.findLowGradeConfig.type,
  });
}

export async function saveLowGradeConfig(params) {
  return request(api.saveLowGradeConfig.api(), {
    method: api.saveLowGradeConfig.type,
    body: params
  });
}

export async function deleteLowGradeConfig(params) {
  return request(api.deleteLowGradeConfig.api(), {
    method: api.deleteLowGradeConfig.type,
    body: params
  });
}