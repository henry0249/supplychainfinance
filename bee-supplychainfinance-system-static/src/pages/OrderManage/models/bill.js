import {
  getInfo,
  getRefused,
  getLogs,
  getChildLogs,
  submitTransfer,
  submitInvoice,
  submitBail,
  submitDelay,
  submitGoods,
  submitWarehouse,
  submitPayment,
  getPaymentCom,
  submitDelivery,
  getBailRecord,
  stopShip,
  submitLetter
} from '../services/bill';

export default {
  namespace: 'bill',
  state: {
    data: null, // 所有类型票据
    refusedInfo: {}, // 退回票据信息
    logs: null, // 票据操作日志
    logsPages: {
      currentPage: 1,
      pageSize: 20,
      totalPage: 1,
      totalRecords: 0
    }, // 票据分页器
    childLogs: null, // 票据操作日志
    childLogsPages: {
      currentPage: 1,
      pageSize: 20,
      totalPage: 1,
      totalRecords: 0
    }, // 票据分页器
    comList: [], // 放款证明公司列表
  },

  effects: {
    // 获取所有类型票据
    * getInfo({ payload, success, error }, { call, put }) {
      const res = yield call(getInfo, payload);
      if (res.code === 0) {
        yield put({
          type: 'setInfo',
          payload: res.data,
        });
        success && success(res.data)
      } else {
        yield put({
          type: 'setInfo',
          payload: null,
        });
        error && error(res.msg);
      }
    },
    // 获取退回的票据信息 未知作用
    * getRefused({ payload, success, error }, { call, put }) {
      const res = yield call(getRefused, payload);
      if (res.code === 0) {
        yield put({
          type: 'setRefusedInfo',
          payload: res.data,
        });
        success && success(res.data)
      } else {
        error && error(res.msg);
      }
    },
    // 获取票据操作日志
    * getLogs({ payload, success, error }, { call, put }) {
      const res = yield call(getLogs, payload);
      if (res.code === 0) {
        yield put({
          type: 'setLogs',
          payload: res,
        });
      } else {
        error && error(res.msg);
      }
    },
    // 获取子订单票据操作日志
    * getChildLogs({ payload, success, error }, { call, put }) {
      const res = yield call(getChildLogs, payload);
      if (res.code === 0) {
        yield put({
          type: 'setChildLogs',
          payload: res,
        });
      } else {
        error && error(res.msg);
      }
    },
    // 提交货权转移证明
    * submitTransfer({ payload, success, error }, { call, put }) {
      const res = yield call(submitTransfer, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 提交开票证明
    * submitInvoice({ payload, success, error }, { call, put }) {
      const res = yield call(submitInvoice, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 提交保证金证明
    * submitBail({ payload, success, error }, { call, put }) {
      const res = yield call(submitBail, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 提交延期提货证明
    * submitDelay({ payload, success, error }, { call, put }) {
      const res = yield call(submitDelay, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 提交提货证明
    * submitGoods({ payload, success, error }, { call, put }) {
      const res = yield call(submitGoods, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 提交付款证明
    * submitPayment({ payload, success, error }, { call, put }) {
      const res = yield call(submitPayment, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 获取付款证明中企业列表
    * getPaymentCom({ payload, success, error }, { call, put }) {
      const res = yield call(getPaymentCom, payload);
      if (res.code === 0) {
        yield put({
          type: 'setPaymentCom',
          payload: res.data,
        });
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 提交放货证明
    * submitDelivery({ payload, success, error }, { call, put }) {
      const res = yield call(submitDelivery, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 提交仓单证明
    * submitWarehouse({ payload, success, error }, { call, put }) {
      const res = yield call(submitWarehouse, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 获取保证金审核记录
    * getBailRecord({ payload, success, error }, { call, put }) {
      const res = yield call(getBailRecord, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 获取保证金审核记录
    * stopShip({ payload, success, error }, { call, put }) {
      const res = yield call(stopShip, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 提交函
    * submitLetter({ payload, success, error }, { call, put }) {
      const res = yield call(submitLetter, payload);
      if (res.code === 0) {
        success && success();
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
    setRefusedInfo(state, action) {
      return {
        ...state,
        refusedInfo: action.payload
      }
    },
    setLogs(state, action) {
      return {
        ...state,
        logs: action.payload.data,
        logsPages: action.payload.page
      }
    },
    setChildLogs(state, action) {
      return {
        ...state,
        childLogs: action.payload.data,
        childLogsPages: action.payload.page
      }
    },
    setPaymentCom(state, action) {
      return {
        ...state,
        comList: action.payload
      }
    },
  }
}
