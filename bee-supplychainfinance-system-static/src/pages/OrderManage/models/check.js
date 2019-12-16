import {
  confirmInvoice,
  returnInvoice,
  checkDelay,
  checkSettlement,
  checkGoods,
  confirmGoods,
  checkBail,
  confirmTransfer,
  returnTransfer,
  paymentSure,
  paymentReturn,
  checkStorage,
  queryPay
} from '../services/check';

// 王尧 负责管理审核的接口
export default {
  namespace: 'check',
  state: {
    payStatus: 0
  },

  effects: {
    // 确认开票证明
    * confirmInvoice({ payload, success, error }, { call, put }) {
      const res = yield call(confirmInvoice, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 退回开票证明
    * returnInvoice({ payload, success, error }, { call, put }) {
      const res = yield call(returnInvoice, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 审核延期提货证明
    * checkDelay({ payload, success, error }, { call, put }) {
      const res = yield call(checkDelay, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 审核结算单
    * checkSettlement({ payload, success, error }, { call, put }) {
      const res = yield call(checkSettlement, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 审核提货申请
    * checkGoods({ payload, success, error }, { call, put }) {
      const res = yield call(checkGoods, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 确认提货申请
    * confirmGoods({ payload, success, error }, { call, put }) {
      const res = yield call(confirmGoods, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 审核保证金
    * checkBail({ payload, success, error }, { call, put }) {
      const res = yield call(checkBail, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 确认货权转移证明
    * confirmTransfer({ payload, success, error }, { call, put }) {
      const res = yield call(confirmTransfer, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 退回货权转移证明
    * returnTransfer({ payload, success, error }, { call, put }) {
      const res = yield call(returnTransfer, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 审核仓单
    * checkStorage({ payload, success, error }, { call, put }) {
      const res = yield call(checkStorage, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 确认收款
    * paymentSure({ payload, success, error }, { call, put }) {
      const res = yield call(paymentSure, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 确认收款拒绝
    * paymentReturn({ payload, success, error }, { call, put }) {
      const res = yield call(paymentReturn, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 查看委托函确认情况
    * queryLetter({ payload, success, error }, { call, put }) {
      const res = yield call(queryLetter, payload);
      if (res.code === 0) {
        success && success();
      } else {
        error && error(res.msg);
      }
    },
    // 查看付款函确认情况
    * queryPay({ payload, success, error }, { call, put }) {
      const res = yield call(queryPay, payload);
      if (res.code === 0) {
        yield put({
          type: 'setPayStatus',
          payload: res.data,
        });
        success && success();
      } else {
        error && error(res.msg);
      }
    },
  },

  reducers: {
    setPayStatus(state, action) {
      return {
        ...state,
        payStatus: action.payload
      }
    },
  }
}