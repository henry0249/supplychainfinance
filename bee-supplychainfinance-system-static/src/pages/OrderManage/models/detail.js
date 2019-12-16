import {
  getOrderInfo,
  getInvoice,
  getChildOrderInfo,
  getLogs,
  saveModeName,
  getApprovalResult
} from '../services/detail';

export default {
  namespace: 'detail',
  state: {
    orderInfo: {},//订单信息
    orderChildInfo: {}, // 子订单信息
    logs: [],//操作日志
    invoice: [],//发货单，
    risk: {} //审批结果
  },
  effects: {
    //获取订单信息
    *getOrderInfo({ payload, success, error }, { call, put }) {
      const response = yield call(getOrderInfo, payload);
      if (response.code === 0) {
        yield put({
          type: 'setOrderInfo',
          payload: response.data,
        });
        success && success(response.data)
      } else {
        yield put({
          type: 'setOrderInfo',
          payload: {},
        });
        error && error(response.msg);
      }
    },
    // 获取销售子订单详情
    * getChildOrderInfo({ payload, success, error }, { call, put }) {
      const response = yield call(getChildOrderInfo, payload);
      if (response.code === 0) {
        yield put({
          type: 'setOrderChildInfo',
          payload: response.data,
        });
        success && success(response)
      } else {
        yield put({
          type: 'setOrderChildInfo',
          payload: {},
        });
        error && error(response.msg);
      }
    },
    //获得操作日志
    *getLogs({ payload, success, error }, { call, put }) {
      const response = yield call(getLogs, payload);
      if (response && response.code === 0) {
        yield put({
          type: 'setLogs',
          payload: response.data,
        });
        success && success(response)
      } else {
        yield put({
          type: 'setLogs',
          payload: [],
        });
        error && error(response.msg);
      }
    },
    //获取发货单信息
    *getInvoice({ payload, success, error }, { call, put }) {
      const response = yield call(getInvoice, payload);
      if (response && response.code === 0) {
        yield put({
          type: 'setInvoice',
          payload: response.data,
        });
        success && success(response.page)
      } else {
        yield put({
          type: 'setInvoice',
          payload: [],
        });
        error && error(response.msg);
      }
    },
    *saveModeName({ payload, success, error }, { call, put }) {
      const res = yield call(saveModeName, payload);
      if (res && res.code === 0) {
        success && success()
      } else {
        error && error(res.msg);
      }
    },
    *getApprovalResult({ payload, success, error }, { call, put }) {
      const res = yield call(getApprovalResult, payload);
      if (res && res.code === 0) {
        yield put({
          type: 'setApprovalResult',
          payload: res.data,
        });
        success && success()
      } else {
        yield put({
          type: 'setInvoice',
          payload: {},
        });
        error && error(res.msg);
      }
    },
  },
  reducers: {
    setOrderInfo(state, action) {
      return {
        ...state,
        orderInfo: action.payload
      }
    },
    setOrderChildInfo(state, action) {
      return {
        ...state,
        orderChildInfo: action.payload
      }
    },
    setLogs(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },
    setInvoice(state, action) {
      return {
        ...state,
        invoice: action.payload,
      };
    },
    setApprovalResult(state, action) {
      return {
        ...state,
        risk: action.payload,
      };
    },
  },
}