import router from 'umi/router';
import { getLargeBuyDetail, checkForwardingCompany,getSubjectMatterList,saveDataFirst,saveDataSecond,saveDataThird,saveDataFourth,getBuyDetail,getSaleDetail,getStorageDetail,getSelectData,getFullDetails,getSubjectMatterInfo } from '../services/incomingstep';
import {message} from 'antd'

export default {
  namespace: 'incomingstep',
  state: {
    buyFirstPartOne:{},
    buyFirstPartTwo:{},
    buyFirstPartThree:{},
    buyFirstPartFour:{},
    commonData:{},
    buyFirstResId:null,
    buyDetail:{},
    largeBuyDetail: {},
    saleDetail:{},
    storageDetail:{}
  },
  effects: {
    *dataFirst({ payload, callback }, { call, put }) {
      const response = yield call(saveDataFirst, payload);
      yield put({
        type: 'saveDataFirst',
        payload: response.data,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *dataSecond({ payload, callback }, { call, put }) {
      const response = yield call(saveDataSecond, payload);
      yield put({
        type: 'saveDataSecond',
        payload: response.data,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *dataThird({ payload, callback }, { call, put }) {
      const response = yield call(saveDataThird, payload);
      yield put({
        type: 'saveDataThird',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *dataFourth({ payload, callback }, { call, put }) {
      const response = yield call(saveDataFourth, payload);
      yield put({
        type: 'saveDataFourth',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *setFirstData({ payload, callback }, { call, put }) {
      yield put({
        type: 'setDataPartOne',
        payload: payload,
      });
      callback && callback(payload)
    },
    *setSecondData({ payload, callback }, { call, put }) {
      yield put({
        type: 'setDataPartTwo',
        payload: payload,
      });
      callback && callback()
    },
    *setThirdData({ payload, callback }, { call, put }) {
      yield put({
        type: 'setDataPartThree',
        payload: payload,
      });
    },
    *setFourthData({ payload, callback }, { call, put }) {
      yield put({
        type: 'setDataPartFour',
        payload: payload,
      });
    },
    *setBuyDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getBuyDetail, payload);
      yield put({
        type: 'setBuyDetail',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *setLargeBuyDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getLargeBuyDetail, payload);
      yield put({
        type: 'setLargeBuyDetail',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *setSaleDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getSaleDetail, payload);
      yield put({
        type: 'setSaleDetail',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *setStorageDetailData({ payload, callback }, { call, put }) {
      const response = yield call(getStorageDetail, payload);
      yield put({  
        type: 'setStorageDetail',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *getSelect({ payload, callback }, { call, put }) {
      const response = yield call(getSelectData, payload);
      yield put({
        type: 'setSelectData',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *getSubjectMatterInfo({ payload, callback }, { call, put }) {
      const response = yield call(getSubjectMatterInfo, payload);
      yield put({
        type: 'setSelectData',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *getSubjectMatterList({ payload, callback }, { call, put }) {
      const response = yield call(getSubjectMatterList, payload);
      yield put({
        type: 'setSelectData',
        payload: response,
      });
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *getCompanyDetail({ payload, callback }, { call, put }) {
      const response = yield call(getFullDetails, payload);
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
    *checkForwardingCompany({ payload, callback }, { call, put }) {
      const response = yield call(checkForwardingCompany, payload);
      if (response.code === 0) {
        callback && callback(response.code,response.msg,response.data)
      }
      else {
        callback && callback(response.code,response.msg)
      }
    },
  },
  reducers: {
    saveBuyFirst(state,action) {
      return {
        ...state,
        buyFirstResId:action.payload
      };
    },
    setDataPartOne(state,action){
      if(state.buyFirstPartOne.purchaserAbbre || state.buyFirstPartOne.clientAbbre || state.buyFirstPartOne.projectSignificance){
        const {payload} = action
        let newData = Object.assign({},state.buyFirstPartOne)
        for(var item in payload){
          newData[item] = payload[item]
        }
        return {
          ...state,
          buyFirstPartOne:newData
        }
      } else {
        return {
          ...state,
          buyFirstPartOne:{...state.buyFirstPartOne,...action.payload}      
        }
      }
      
    },
    setDataPartTwo(state,action){
        return {
          ...state,
          buyFirstPartTwo:{...state.buyFirstPartTwo,...action.payload}      
        }
    },
    setDataPartThree(state,action){
        if(state.buyFirstPartThree.assureFinanceList || state.buyFirstPartThree.companyInfoBuyDTO || state.buyFirstPartThree.supplierFinanceList){
          const {payload} = action
          let newData = Object.assign({},state.buyFirstPartThree)
          for(var item in payload){
            newData[item] = payload[item]
          }
          return {
            ...state,
            buyFirstPartThree:newData     
          }
        } else {
          const {payload} = action
          let newData = Object.assign({},state.buyFirstPartThree)
          for(var item in payload){
            newData[item] = payload[item]
          }
          return {
            ...state,
            buyFirstPartThree:newData     
          }
        }
    },
    setDataPartFour(state,action){
      if(state.buyFirstPartFour.assureFinanceList || state.buyFirstPartFour.companyInfoBuyDTO || state.buyFirstPartFour.supplierFinanceList){
        const {payload} = action
        let newData = Object.assign({},state.buyFirstPartFour)
        for(var item in payload){
          newData[item] = payload[item]
        }
        return {
          ...state,
          buyFirstPartFour:newData     
        }
      } else {
        const {payload} = action
        let newData = Object.assign({},state.buyFirstPartFour)
        for(var item in payload){
          newData[item] = payload[item]
        }
        return {
          ...state,
          buyFirstPartFour:newData     
        }
      }
    },
    setBuyDetail(state,action) {
      return {
        ...state,
        buyDetail:action.payload
      };
    },
    setLargeBuyDetail(state,action) {
      return {
        ...state,
        largeBuyDetail:action.payload
      };
    },
    setSaleDetail(state,action) {
      return {
        ...state,
        saleDetail:action.payload
      };
    },
    setStorageDetail(state,action) {
      return {
        ...state,
        storageDetail:action.payload
      };
    },
  },
};
