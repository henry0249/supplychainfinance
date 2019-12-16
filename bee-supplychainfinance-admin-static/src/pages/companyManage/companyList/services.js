import request from '../../../common/request';
import api from './api';

// 获取企业信息
export async function getInfo(params) {
  return request(api.getInfo.api(params), {
    method: api.getInfo.type
  });
}
//查询企业历史详情
export async function getCompanyInfo(params) {
  return request(api.getComInfo.api(params), {
    method: api.getComInfo.type
  });
}

// 获取所有省区市
export async function getRegion() {
  return request(api.getRegion.api());
}

// 获取所有行业
export async function getIndustry() {
  return request(api.getIndustry.api());
}

// 保存企业信息
export async function updateInfo(params) {
  return request(api.updateInfo.api(), {
    body: params,
    method: api.updateInfo.type
  });
}


//老数据
// 查询企业关联审核列表
export async function getData(obj) {
  return request(api.getData.api(obj.url), {
    body: obj.params,
    method: api.getData.type
  });
}

// 审核企业关联
export async function checkCompany(params) {
  return request(api.checkCompany.api(), {
    body: params,
    method: api.checkCompany.type
  });
}

// 获取企业关联详情
export async function getDetails(id) {
  return request(api.getDetails.api(id), {
    method: api.getDetails.type
  });
}

//权限相关接口
//根据条件查询企业
export async function getCompanysList(params) {
  return request(api.getCompanys.api(params.url), {
    method: api.getCompanys.type,
    body:params.body
  });
}
//修改企业
export async function updateCompanyInfo(params={}) {
  return request(api.updateCompany.api(params), {
    method: api.updateCompany.type,
    body:params
  },true);
}
//删除企业
export async function deleteCompanyInfo(params={}) {
  return request(api.deleteCompany.api(params), {
    method: api.deleteCompany.type,
    body:params
  },false);
}
//添加企业
export async function addCompanyInfo(params={}) {
  return request(api.addCompany.api(params), {
    method: api.addCompany.type,
    body:params
  },false);
}
//查看单个企业详情
export async function getEnterpriseDetail(params={}) {
  return request(api.authEnterprise.api(params), {
    method: api.authEnterprise.type
  });
}
//查询所有企业信息--树形结构
export async function getAllCompanys(params={}) {
  return request(api.getAllCompanysTree.api(params), {
    method: api.getAllCompanysTree.type
  });
}
  //查询企业下的所有应用树
export async function getEnterpriseRoleTree(params={}) {
  return request(api.getEnterpriseRoleTreeList.api(params), {
    method: api.getEnterpriseRoleTreeList.type
  });
}
  //保存企业角色配置的修改
export async function updateRoleData(params={}) {
  return request(api.updateRole.api(params), {
    method: api.updateRole.type,
    body:params
  },false);
}
  //查询企业下所有已开通的功能的id
export async function getFuns(params={}) {
  return request(api.getFunsIds.api(params), {
    method: api.getFunsIds.type,
  });
}

