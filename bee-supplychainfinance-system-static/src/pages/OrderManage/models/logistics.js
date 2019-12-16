import {
  getLogisticsInfo,
  delLogisticsAccessory,
  getLogisticsLog,
  saveLogisticsInfo,
  updateLogisticsInfo
} from "../services/logistics"

export default {
  namespace: "logistics",
  state: {
    logisticsInfo: {},
    logisticsLog: {}
  },
  effects: {
    *getLogisticsInfo({payload, callback}, {call, put}) {
      //查询物流信息  采购
      const res = yield call(getLogisticsInfo, payload)
      if (res && res.code === 0) {
        yield put({
          type: "saveLogisticsInfo",
          payload: res.data
        })
      }
      callback && callback(res)
    },
    *delLogisticsAccessory({payload, callback}, {call, put}) {
      //删除附件信息
      const res = yield call(delLogisticsAccessory, payload)
      if (res && res.code === 0) {
        callback && callback(res)
      }
    },
    *getLogisticsLog({payload, callback}, {call, put}) {
      //获取物流操作日志
      const res = yield call(getLogisticsLog, payload)
      if (res && res.code === 0) {
        yield put({
          type: "saveLogisticsLog",
          payload: res.data
        })
      }
      callback && callback(res)
    },
    *saveBLogisticsInfo({payload, callback}, {call, put}) {
      //保存物流信息  委托采购
      const res = yield call(saveLogisticsInfo, payload)
      if (res && res.code === 0) {
        yield put({
          type: "saveLogisticsInfo",
          payload: res.data
        })
      }
      callback && callback(res)
    },
    *updateLogisticsInfo({payload, callback}, {call, put}) {
      //更新物流信息  委托采购
      const res = yield call(updateLogisticsInfo, payload)
      if (res && res.code === 0) {
        yield put({
          type: "saveLogisticsInfo",
          payload: res.data
        })
      }
      callback && callback(res)
    },
  },
  reducers: {
    saveLogisticsInfo(state, action) {
      //保存物流信息
      return {
        ...state,
        logisticsInfo: action.payload
      }
    },
    saveLogisticsLog(state, action) {
      //保存操作日志
      return {
        ...state,
        logisticsLog: action.payload
      }
    },
  }
}