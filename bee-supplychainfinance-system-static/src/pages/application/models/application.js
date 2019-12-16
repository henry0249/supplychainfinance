import router from 'umi/router'
import {
  getData,
  getCount,
  getList,
  getProcessScheduleDetail,
  getFlowChart,
  getBuyDetail,
  getSaleDetail,
  getStorageDetail,
  getLargeBuyDetail
} from '../services/index'
import { message } from 'antd'

export default {
  namespace: 'application',
  state: {
    data: {},
    logs: [],
    report: {},
    log: '',
    log: [],
    process: { state: 0, list: [{ name: '', time: '' }] },
    list: [],
    counts: {},
    people: [],
    factor: [],
    auditMsg: [],
    chart: {},
    otherInfo: '',
    scoreRisk: {},
    able: false,
    businessMode: Number(sessionStorage.businessMode) || 0 //业务类型 0委托采购 1委托销售2 金融仓储
  },
  effects: {
    *getDetail({ payload, callback }, { call, put }) {
      //获取详情
      const response = yield call(getProcessScheduleDetail, payload.applyId)
      if (response.code === 0) {
        yield put({
          type: 'setData',
          payload: response.data
        })
        callback && callback(response)
      }
    },
    *fetch({ payload, success }, { put, call }) {
      const res = yield call(getList, payload)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: res.data
        })
        success && success(res.page)
      }
    },
    *getCount({ payload, success }, { put, call }) {
      const res = yield call(getCount, payload)
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
    *getData({ payload, callback }, { call, put }) {
      const response = yield call(getData, payload)
      if (response.code === 1) {
        yield put({
          type: 'setData',
          payload: response.data
        })
      }
      callback && callback(response.code, response.msg)
    },
    *getFlowChart({ payload, callback }, { call, put }) {
      //获得审批进度
      const response = yield call(getFlowChart, payload.applyId)
      if (response.code === 0) {
        yield put({
          type: 'setProcess',
          payload: processHandle(response.data)
        })
        callback && callback(response)
      } else {
        callback && callback(response.code, response.msg)
      }
    },
    *getProcess({ payload, callback }, { call, put }) {
      const response = yield call(get, payload)
      yield put({
        type: 'setProcess',
        payload: response
      })
    },
    *pickBusinessMode({ payload, callback }, { call, put }) {
      //设置业务类型
      yield put({
        type: 'setBusinessMode',
        payload: payload
      })
      sessionStorage.setItem('businessMode', payload)
      callback && callback()
    },
    *setBuyDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getBuyDetail, payload)
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data)
      } else {
        callback && callback(response.code, response.msg)
      }
    },
    *setLargeBuyDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getLargeBuyDetail, payload)
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data)
      } else {
        callback && callback(response.code, response.msg)
      }
    },
    *setSaleDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getSaleDetail, payload)
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data)
      } else {
        callback && callback(response.code, response.msg)
      }
    },
    *setStorageDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getStorageDetail, payload)
      if (response.code === 0) {
        callback && callback(response.code, response.msg, response.data)
      } else {
        callback && callback(response.code, response.msg)
      }
    }
  },
  reducers: {
    setData(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },
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
    setProcess(state, action) {
      return {
        ...state,
        process: action.payload
      }
    },
    setBusinessMode(state, action) {
      return {
        ...state,
        businessMode: action.payload
      }
    }
  }
}

const processHandle = datas => {
  //进程的数据处理
  return {
    state: datas.actualStatus,
    list: datas.list.map((item, index) => {
      if (index <= datas.actualStatus + 1) {
        return { name: item.modifier, time: item.modifyTime }
      }
    })
  }
}
