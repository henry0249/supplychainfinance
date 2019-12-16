import request from '@/utils/request'
import apis  from '../apis/warning'

//获取业务进度
export async function getSteps(params) {
  return request(apis.getSteps.api(params),{ method: 'GET' });
}

//获取预警信息列表
export async function getWarningList(params) {
  return request(apis.getWarningList.api(params.url),{
    method: apis.getWarningList.type
  })
}

//获取操作日志
export async function getLogs(params) {
  return request(apis.getLogs.api(params.url), { method:apis.getLogs.type});
}

//增加预警
export async function addWarning(params) {
  return request(apis.addWarning.api(), 
  {
    method:apis.addWarning.type,
    body:params,
  });
}

//预警处理
export async function handleWarning(params) {
  return request(apis.handleWarning.api(), 
  {
    method:apis.handleWarning.type,
    body:params,
  });
}