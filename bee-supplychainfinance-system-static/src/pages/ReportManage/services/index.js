import request from '@/utils/request';
import api from "./api"

export function exportExcel(params) {
  return request(api.exportExcel.api(), {
    method: api.exportExcel.type,
    body: params
  }, true)
} 