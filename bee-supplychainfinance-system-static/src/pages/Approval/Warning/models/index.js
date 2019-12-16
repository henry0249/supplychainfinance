import {
  getSteps,
  getWarningList,
  getLogs,
  handleWarning,
} from '../../../OrderManage/services/warning';

export default {
  namespace: 'warningApply',
  state: {
    steps: [],//业务进度
    warningList: [],//预警信息列表
    logs: [],//操作日志
  },
  effects: {

    //获取业务进度
    *getSteps({ payload, callback }, { call, put }) {
      const response = yield call(getSteps, payload);
      if (response.code === 0) {
        yield put({
          type: 'setSteps',
          payload: response.data,
        });
      }
      else {
        callback && callback(response.code, response.msg)
      }
    },

    //获取预警信息列表
    *getWarningList({ payload, success }, { call, put }) {
      const res = yield call(getWarningList, payload)
      if (res && res.code === 0) {
        yield put({
          type: "setWarningList",
          payload: res.data
        })
        success && success(res.page)
      } else {
        success && success(res)
      }
    },

    //获得操作日志
    *getLogs({ payload, success }, { call, put }) {
      const response = yield call(getLogs, payload);
      if (response.code === 0) {
        yield put({
          type: 'setLogs',
          payload: response.data,
        });
        success && success(response.page)
      }
      else {
        success && success(response.code, response.msg)
      }
    },

    *handleWarning({ payload, success }, { call, put }) {
      const response = yield call(handleWarning, payload);
      success && success(response)
    },
  },
  reducers: {
    setSteps(state, action) {
      return {
        ...state,
        steps: action.payload
      }
    },
    setWarningList(state, action) {
      return {
        ...state,
        warningList: action.payload
      }
    },
    setLogs(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },
  },

}
