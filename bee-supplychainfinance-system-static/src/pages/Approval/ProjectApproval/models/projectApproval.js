import router from 'umi/router'
import {
  getData,
  getCount,
  getList,
  getLogs,
  queryBackRole,
  submitBack,
  agree,
  agreeApproval,
  getRiskFactor,
  getAuditMsg,
  getReport,
  getPriceTrend,
  getOtherInfo,
  getEnclosure,
  addRiskFactor,
  getScoreRisk,
  getProcessScheduleDetail,
  getFlowChart,
  refuse,
  getIsAudit,
  getScoreRiskMacroeconomic,
  getBuyDetail,
  getSaleDetail,
  getStorageDetail,
  getLargeBuyDetail,
  updateRiskScore
} from '../services/index'
import { message } from 'antd'

export default {
  namespace: 'projectApproval',
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
    *getEnclosure({ payload, callback }, { call, put }) {
      const response = yield call(getEnclosure, payload.applyId)
      if (response.code === 0) {
        yield put({
          type: 'setEnclosure',
          payload: response
        })
      } else {
        callback && callback(response.code, response.msg)
      }
    },
    *getOtherInfo({ payload, callback }, { call, put }) {
      const response = yield call(getOtherInfo, payload.applyId)
      if (response.code === 0) {
        yield put({
          type: 'setOtherInfo',
          payload: response
        })
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
    *getScoreRisk({ payload, callback }, { call, put }) {
      const response = yield call(getScoreRisk, payload)
      if (response.code === 0) {
        callback && callback(response.data)
        yield put({
          type: 'setScoreRisk',
          payload: response.data
        })
      } else {
        yield put({
          type: 'setScoreRisk',
          payload: {}
        })
        callback && callback(response.code, response.msg)
      }
    },
    *updateRiskScore({ payload, callback }, { call, put }) {
      const response = yield call(updateRiskScore, payload)
      if (response.code === 0) {
        callback && callback(response.data)
        yield put({
          type: 'setScoreRisk',
          payload: response.data
        })
      } else {
        yield put({
          type: 'setScoreRisk',
          payload: {}
        })
        callback && callback(response.code, response.msg)
      }
    },
    *getScoreRiskMacroeconomic({ payload, callback }, { call, put }) {
      const response = yield call(getScoreRiskMacroeconomic, payload)
      if (response.code === 0) {
        callback && callback(response.data)
        yield put({
          type: 'setScoreRisk',
          payload: response.data
        })
      } else {
        yield put({
          type: 'setScoreRisk',
          payload: {}
        })
        callback && callback(response.code, response.msg)
      }
    },
    *getLogs({ payload, callback }, { call, put }) {
      //获得操作日志
      const response = yield call(getLogs, payload)
      if (response.code === 0) {
        yield put({
          type: 'setLogs',
          payload: response.data
        })
      } else {
        callback && callback(response.code, response.msg)
      }
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
    *queryBackRole({ payload }, { call, put }) {
      const res = yield call(queryBackRole, payload)
      if (res.code === 0) {
        yield put({
          type: 'savePeople',
          payload: res.data
        })
      }
    },
    *submitBack({ payload, success }, { call, put }) {
      yield call(submitBack, payload)
      success && success()
    },
    *agree({ payload, callback }, { call, put }) {
      const res = yield call(agree, payload)
      if (res.code === 0) {
        callback && callback(res)
      } else {
        message.error(res.msg)
      }
    },
    *refuse({ payload, callback }, { call, put }) {
      const res = yield call(refuse, payload)
      if (res.code === 0) {
        callback && callback(res)
      }
    },
    *agreeApproval({ payload, callback }, { call, put }) {
      const res = yield call(agreeApproval, payload)
      if (res.code === 0) {
        callback && callback(res)
      } else {
        message.error(res.msg)
      }
    },
    *getRiskFactor({ payload }, { call, put }) {
      const res = yield call(getRiskFactor, payload)
      if (res.code === 0) {
        yield put({
          type: 'saveFactor',
          payload: res.data.riskElementDTOList
        })
      }
    },
    *getAuditMsg({ payload }, { call, put }) {
      const res = yield call(getAuditMsg, payload)
      if (res.code === 0) {
        yield put({
          type: 'saveAuditMsg',
          payload: res.data
        })
      }
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
    },
    *getIsAudit({ payload, callback }, { call, put }) {
      const res = yield call(getIsAudit, payload)
      if (res.code === 0) {
        yield put({
          type: 'setIsAudit',
          payload: res.data
        })
      }
      callback && callback(res)
    },
    *addRiskFactor({ payload, success }, { call, put }) {
      const res = yield call(addRiskFactor, payload)
      if (res.code === 0) {
        success && success()
      }
    },
    *getReport({ payload, callback }, { call, put }) {
      //获取立项报告
      const response = yield call(getReport, payload)
      if (response.code === 0) {
        yield put({
          type: 'setReport',
          payload: response
        })
      } else {
        callback && callback(response)
      }
    },
    *getPriceTrend({ payload, callback }, { call, put }) {
      //获取价格走势
      const response = yield call(getPriceTrend, payload)
      if (response.code === 0) {
        yield put({
          type: 'setPriceTrend',
          payload: response
        })
        callback && callback(response)
      } else {
        yield put({
          type: 'setPriceTrend',
          payload: { data: {} }
        })
        callback && callback(response)
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
    setReport(state, action) {
      return {
        ...state,
        report: action.payload
      }
    },
    setScoreRisk(state, action) {
      return {
        ...state,
        scoreRisk: action.payload
      }
    },
    setPriceTrend(state, action) {
      return {
        ...state,
        chart: action.payload
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
    setData(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },
    setIsAudit(state, action) {
      return {
        ...state,
        able: action.payload
      }
    },
    setProcess(state, action) {
      return {
        ...state,
        process: action.payload
      }
    },
    setLogs(state, action) {
      return {
        ...state,
        logs: action.payload
      }
    },
    setBusinessMode(state, action) {
      return {
        ...state,
        businessMode: action.payload
      }
    },
    savePeople(state, action) {
      return {
        ...state,
        people: action.payload
      }
    },
    saveFactor(state, action) {
      return {
        ...state,
        factor: action.payload
      }
    },
    saveAuditMsg(state, action) {
      return {
        ...state,
        auditMsg: action.payload
      }
    },
    setEnclosure(state, action) {
      return {
        ...state,
        log: action.payload
      }
    },
    setOtherInfo(state, action) {
      return {
        ...state,
        otherInfo: action.payload
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
