import {
  getContract,
  refuseContract,
  submitContract,
  getWarnings,
  saveWarnings,
  updateWarnings
} from "../services/appContract";

export default {
  namespace: "appContract",
  state: {
    warningData: {},
    businessMode: sessionStorage.businessMode || '0',
  },
  effects: {
    //合同详情获取（合同word）
    *getContractDetail({ payload, callback }, { call, put }) {
      const response = yield call(getContract, payload);
      yield put({
        type: "getDetail",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //退回合同流程
    *refuse({ payload, callback }, { call, put }) {
      const response = yield call(refuseContract, payload);
      yield put({
        type: "refuseContract",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //提交合同流程
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(submitContract, payload);
      yield put({
        type: "passContract",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //根据订单业务id获取委托采购风控预警配置信息
    *getWarning({ payload, callback }, { call, put }) {
      const response = yield call(getWarnings, payload);
      yield put({
        type: "gotWarning",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //保存委托采购风控预警配置信息
    *saveWarnings({ payload, callback }, { call, put }) {
      const response = yield call(saveWarnings, payload);
      yield put({
        type: "setWarning",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //更新委托采购风控预警配置信息
    *updateWarning({ payload, callback }, { call, put }) {
      const response = yield call(updateWarnings, payload);
      yield put({
        type: "putWarnings",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //设置预警数据
    *setWarningData({ payload, callback }, { call, put }) {
      yield put({
        type: "setData",
        payload: payload
      });
    },
    //设置业务类型
    *setType({ payload, callback }, { call, put }) {
      yield put({
        type: "setBusinessMode",
        payload: payload
      });
      sessionStorage.setItem("businessMode", payload)     
      callback && callback();
    }
  },
  reducers: {
    setData(state, action) {
      return {
        ...state,
        warningData: action.payload
      };
    },
    setBusinessMode(state, action) {
      return {
        ...state,
        businessMode: action.payload
      };
    }
  }
};
