import {
  getAllContract,
  newContract,
  removeContract,
  getSignedContract,
  removeSignedContract,
  saveSignedContract,
  getLog,
  getContractStatus,
  getContract,
  sureContract,
  uploadContract
} from "../services/contract";

export default {
  namespace: "contract",
  state: {
    contractData: [],
  },
  effects: {
    //合同管理 获取所有合同
    *getAllContracts({ payload, callback }, { call, put }) {
      const response = yield call(getAllContract, payload);
      yield put({
        type: "getAll",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //合同新建或编辑（基础信息)
    *createNewContract({ payload, callback }, { call, put }) {
      const response = yield call(newContract, payload);
      yield put({
        type: "createContract",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //设置新建合同数据
    *setContractData({ payload, callback }, { call, put }) {
      yield put({
        type: "setData",
        payload: payload
      });
    },
    //合同删除（基础信息）
    *deleteContract({ payload, callback }, { call, put }) {
      const response = yield call(removeContract, payload);
      yield put({
        type: "delContract",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //已签订合同列表
    *signedContracts({ payload, callback }, { call, put }) {
      const response = yield call(getSignedContract, payload);
      yield put({
        type: "signedContract",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //已签订合同删除
    *deleteSignedContract({ payload, callback }, { call, put }) {
      const response = yield call(removeSignedContract, payload);
      yield put({
        type: "removeSignedContract",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //已签订合同保存
    *saveNewSignedContract({ payload, callback }, { call, put }) {
      const response = yield call(saveSignedContract, payload);
      yield put({
        type: "setSignedContract",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //根据订单业务id查询合同相关日志信息
    *getLogInfo({ payload, callback }, { call, put }) {
      const response = yield call(getLog, payload);
      yield put({
        type: "getContractLog",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //查看合同确认情况
    *getStatus({ payload, callback }, { call, put }) {
      const response = yield call(getContractStatus, payload);
      yield put({
        type: "saveStatus",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
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
    //确认合同
    *confirmContract({ payload, callback }, { call, put }) {
      const response = yield call(sureContract, payload);
      yield put({
        payload: response.data,
        type: "confirm"
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },
    //合同详情修改合同word文件
    *updateContractURL({ payload, callback }, { call, put }) {
      const response = yield call(uploadContract, payload);
      yield put({
        type: "changeFileURL",
        payload: response.data
      });
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data);
      } else {
        callback && callback(response.code, response.msg);
      }
    },

  },
  reducers: {
    setData(state, action) {
      return {
        ...state,
        contractData: action.payload
      };
    },
  }
};
