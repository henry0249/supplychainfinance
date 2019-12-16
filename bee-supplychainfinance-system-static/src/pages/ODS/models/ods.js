import {
  getTagTypes
} from '../services/index'
import { message } from 'antd'

export default {
  namespace: 'ods',
  state: {
    tabTypes: []//tab类型
  },
  effects: {
    *getTabTypes({ payload, callback }, { call, put }) {
      const response = yield call(getTagTypes, payload)
      if (response.code === 0 && response.data) {
        yield put({
          type: 'setTagTypes',
          payload: response.data
        })
        callback && callback(response.data)
      } else {
        message.error(response.msg)
      }
    },
    *throwError() {
      throw new Error('hi error')
    },
  },
  reducers: {
    setTagTypes(state, action) {
      return {
        ...state,
        tabTypes: action.payload
      }
    }
  }
}
