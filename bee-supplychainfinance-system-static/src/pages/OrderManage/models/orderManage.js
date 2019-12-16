import {
  getCounts,
  getList,
} from '../services/orderManage';
import { utils } from '@/utils';

export default {
  namespace: 'orderManage',
  state: {
    counts: {},//订单首页数量统计
    list: [],//列表数据
    businessMode: Number(sessionStorage.businessMode) || 0,//业务类型 0委托采购 1委托销售2 金融仓储
  },
  effects: {

    //设置业务类型
    *pickBusinessMode({ payload, callback }, { call, put }) {
      yield put({
        type: 'setBusinessMode',
        payload: payload,
      });
      sessionStorage.setItem("businessMode", payload)
      callback && callback();
    },

    //获取订单数量统计
    *getCounts({ payload, success, error }, { call, put }) {
      const response = yield call(getCounts, payload)
      if (response && response.code === 0) {
        yield put({
          type: 'setCounts',
          payload: response.data,
        });
        success && success(response)
      }
      else {
        yield put({
          type: 'setCounts',
          payload: {},
        });
        error && error(response)
      }
    },

    //获取列表数据
    *getList({ payload, success }, { call, put }) {
      yield put({
        type: 'setList',
        payload: [],
      });
      const response = yield call(getList, payload);
      if (response && response.code === 0) {
        yield put({
          type: 'setList',
          payload: response.data,
        });
        success && success(response)
      }
      else {
        yield put({
          type: 'resetList',
          payload: null,
        });
        success && success(response)
      }
    },

  },
  reducers: {
    setBusinessMode(state, action) {
      return {
        ...state,
        businessMode: action.payload
      }
    },
    setCounts(state, action) {
      return {
        ...state,
        counts: action.payload
      }
    },
    resetCounts(state, action) {
      return {
        ...state,
        counts: {},
      }
    },
    setList(state, action) {
      return {
        ...state,
        list: handleData(action.payload)
      }
    },
    resetList(state, action) {
      return {
        ...state,
        list: [],
      }
    },
  },

}

const handleData = (data) => {
  const expandedRowKeys = {}
  for (let i = 0; i < data.length; i++) {
    data[i]['flag'] = 1;
    data[i]['key'] = utils.guid()
    if (data[i].largeBuySubOrderDTOList && data[i].largeBuySubOrderDTOList.length > 0) {
      for (let j = 0; j < data[i].largeBuySubOrderDTOList.length; j++) {
        data[i].largeBuySubOrderDTOList[j]['flag'] = 0
        data[i].largeBuySubOrderDTOList[j]['key'] = utils.guid()
        // data[i].largeBuySubOrderDTOList[j]['ordersId'] = data[i].largeBuySubOrderDTOList[j].largeBuySubOrdersId
        // delete data[i].largeBuySubOrderDTOList[j].largeBuySubOrdersId
        data[i].largeBuySubOrderDTOList[j]['ordersId'] = data[i].ordersId
        data[i].largeBuySubOrderDTOList[j]['num'] = data[i].largeBuySubOrderDTOList[j]['largeBuySubOrdersName'].split('发货单')[1]
        data[i].largeBuySubOrderDTOList[j]['modeName'] = data[i].largeBuySubOrderDTOList[j]['largeBuySubOrdersName'] + '    ' + data[i].largeBuySubOrderDTOList[j].createTime
      }
      data[i]['children'] = data[i].largeBuySubOrderDTOList
    } else if (data[i].saleSubOrderDTOList && data[i].saleSubOrderDTOList.length > 0) {

      for (let j = 0; j < data[i].saleSubOrderDTOList.length; j++) {
        data[i].saleSubOrderDTOList[j]['flag'] = 0
        data[i].saleSubOrderDTOList[j]['key'] = utils.guid()
        // data[i].saleSubOrderDTOList[j]['ordersId'] = data[i].saleSubOrderDTOList[j].subSaleOrdersId
        data[i].saleSubOrderDTOList[j]['ordersId'] = data[i].ordersId
        // delete data[i].saleSubOrderDTOList[j].subSaleOrdersId
        data[i].saleSubOrderDTOList[j]['num'] = data[i].saleSubOrderDTOList[j]['subSaleOrdersName'].split('发货单')[1]
        data[i].saleSubOrderDTOList[j]['modeName'] = data[i].saleSubOrderDTOList[j]['subSaleOrdersName'] + '    ' + data[i].saleSubOrderDTOList[j].createTime
      }
      data[i]['children'] = data[i].saleSubOrderDTOList
    } else {
      data[i]['children'] = null
    }

    delete data[i].largeBuySubOrderDTOList
    delete data[i].saleSubOrderDTOList

  }
  // console.log(data)
  return data

}
