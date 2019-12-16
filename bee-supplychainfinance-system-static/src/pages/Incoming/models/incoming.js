import { getApplyCount, getApplyList, deleteApply } from '../services/index'
import { message } from 'antd'

export default {
  namespace: 'incoming',
  state: {
    list: [],
    counts: {},
    mode: sessionStorage.businessMode ? sessionStorage.businessMode : 2
  },
  effects: {
    *fetch({ payload, success }, { put, call }) {
      const res = yield call(getApplyList, payload)
      yield put({
        type: 'save',
        payload: res.data
      })
      if (!res.data || res.data.length === 0) {
        return message.error('没有查询到满足条件的立项申请')
      } else {
        success && success(res.page)
      }
    },
    *getCount({ payload, success }, { put, call }) {
      const res = yield call(getApplyCount, payload)
      if (res.code === 0) {
        yield put({
          type: 'saveCount',
          payload: res.data
        })
        success && success(res.data)
      } else {
        success && success(res)
      }
    },
    *delete({ payload, success }, { put, call }) {
      const res = yield call(deleteApply, payload)
      message.success('删除成功')
      success && success()
    },
    *pickIcomingMode({ payload, callback }, { call, put }) {
      //设置业务类型
      yield put({
        type: 'setIcomingMode',
        payload: payload
      })
      sessionStorage.setItem('businessMode', payload)
      callback && callback()
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload
      }
    },
    saveCount(state, action) {
      return {
        ...state,
        counts: action.payload
      }
    },
    setIcomingMode(state, action) {
      return {
        ...state,
        mode: action.payload
      }
    }
  }
}
