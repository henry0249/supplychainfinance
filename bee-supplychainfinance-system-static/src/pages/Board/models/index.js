import { getBoard } from "../services"

export default {
  namespace: "board",
  state: {
    userInfo: {},
    things: {},
    orderList: [], //进行中的订单
    industry: [], //行业咨询
    orderDynamics: {}, //订单动态
    riskCount: [], //风险事件统计
    riskRatio: {}, //风险事件占比
  },
  effects: {
    * getBoard({payload, callback}, {call, put}) {
      const res = yield call(getBoard, payload);
      callback(res)
    }
  }
}