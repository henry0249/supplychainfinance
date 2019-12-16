import request from '@/utils/request'
import data from './data'

// 获取进度
export async function getResult(params = {}) {
  return request(data[params.type].api(params.id), {})
}
