import request from "@/common/request";
import api from '../apis';

export async function getUserList(params={}) {
  return request(api.getUserList.api(params));
}

export async function getApplyList(params) {
  return request(api.getApplyList.api(params.url), {
    method: api.getApplyList.type,
    body: params.params
  });
}

export async function deleteApply(id) {
  return request(api.deleteApply.api(id), {
    method: api.deleteApply.type,
  });
}

export async function getRoles() {
  return request(api.getRoles.api(), {
    method: api.getRoles.type,
  });
}

export async function getTeamList() {
  return request(api.getTeamList.api(), {
    method: api.getTeamList.type,
  });
}

export async function getTeam() {
  return request(api.getTeam.api(), {
    method: api.getTeam.type,
  });
}

export async function getUserTeam(id) {
  return request(api.getUserTeam.api(id), {
    method: api.getUserTeam.type,
  });
}

export async function changeRole(params) {
  return request(api.changeRole.api(params), {
    method: api.changeRole.type,
    body: params
  });
}

export async function editTeam(params) {
  return request(api.editTeam.api(params), {
    method: api.editTeam.type,
    body: params
  });
}

export async function addTeam(params) {
  return request(api.addTeam.api(params), {
    method: api.addTeam.type,
    body: params
  });
}

export async function deleteTeam(params) {
  return request(api.deleteTeam.api(params.teamId), {
    method: api.deleteTeam.type,
    body: params
  });
}



