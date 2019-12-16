import {
  getInfo,
  getsituation,
  confirm,
  save,
  getRefused
} from '../services/settlement';

export default {
  namespace: 'settlement',
  state: {
    data: {}, //结算单信息
    refused: {}
  },

  effects: {
    // 获取结算单信息
    * getInfo({ payload, success, error }, { call, put }) {
      const res = yield call(getInfo, payload);
      if (res.code === 0) {
        yield put({
          type: 'setInfo',
          payload: res.data,
        });
        success && success(res.data)
      } else {
        error && error(res.msg);
      }
    },
    // 获取结算单确认情况
    * getsituation({ payload, success, error }, { call, put }) {
      const res = yield call(getsituation, payload);
      if (res.code === 0) {
        success && success(res.data)
      } else {
        error && error(res.msg);
      }
    },
    // 确认结算单
    * confirm({ payload, success, error }, { call, put }) {
      const res = yield call(confirm, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 保存结算单
    * sava({ payload, success, error }, { call, put }) {
      const res = yield call(save, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    * getRefused({ payload, success, error }, { call, put }) {
      const res = yield call(getRefused, payload);
      if (res.code === 0) {
        yield put({
          type: 'setRefused',
          payload: res.data,
        });
        success && success(res.data)
      } else {
        error && error(res.msg);
      }
    },
  },

  reducers: {
    setInfo(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },
    setRefused(state, action) {
      return {
        ...state,
        refused: action.payload
      }
    },
  }
}
