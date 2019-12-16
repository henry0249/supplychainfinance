import React, { Component } from 'react'
import { Row, Col, Card, List, Avatar } from 'antd';
import moment from "moment"
import styles from "./index.less"
import Link from 'umi/link';

const typeZero = ["签订销售合同", "提交保证金", "签订采购合同", "转移货权", "支付货款", "供应商开票", "回款提货", "延期申请中", "等待放货", "结算确认", "开票收票", "已完成"];
const typeOne = ["签订委托合同", "提交保证金", "签订销售合同", "货权转移", "", "", "", "", "", "", "", "冻结中", "已完成", "终止发货"];
const typeTwo = ["签订合同", "提交仓单", "延期申请中", "回款提货", "等待放货", "转移货权", "结算确认", "委托企业收票", "冻结中", "已完成"]
const typeFour = ["签订销售合同", "提交保证金", "签订采购合同", "转移货权", "终止发货", "冻结中", "已完成"]
export default class OrderList extends Component {
  constructor() {
    super()
  }

  render() {
    let { notice } = this.props
    const obj = {
      minHeight: "400px",
      textAlign: "center",
      lineHeight: "400px",
    }
    const itemStyle={ xxl: 8, xl: 8, lg: 12, md: 12, sm: 24, xs: 24 }
    return (
      <div className={styles.OrderListWrap}>
        <Card
          className={styles.projectList}
          style={{ marginBottom: 24 }}
          title="进行中的订单"
          bordered={false}
          extra={<Link to="/orderManage/index">全部订单</Link>}
          // loading={projectLoading}
          bodyStyle={notice.length !== 0 ? { padding: 0 } : { padding: 0, textAlign: 'center' }}
        >
          <Row>
            {
              notice.length !== 0
                ?
                notice.map(item => (<Col {...itemStyle} key={item.modifyTime} >
                  <Card.Grid  >
                    <Card bodyStyle={{ padding: 0 }} bordered={false}>
                      <Card.Meta
                        title={
                          <div className={styles.cardTitle}>
                            <span>{item.companyName}</span>
                            <span style={{ fontWeight: "normal", float: "right" }}>
                              {
                                item.type === 0
                                  ?
                                  typeZero[item.orderStatus]
                                  :
                                  item.type === 1
                                    ?
                                    typeOne[item.orderStatus]
                                    :
                                    item.type === 2
                                      ?
                                      typeTwo[item.orderStatus]
                                      :
                                      item.type === 4
                                        ?
                                        typeFour[item.orderStatus]
                                        :
                                        ""
                              }
                            </span>
                          </div>
                        }
                        description={
                          <div>
                            <div>
                              <span>业务模式 </span>: <span>{item.type === 0 ? "委托采购" : item.type === 1 ? "委托销售" : item.type === 2 ? "金融仓储" : "大企业委托采购"}</span>
                            </div>
                            <div>
                              <span>货物 </span>: <span>{item.goodsName}</span>
                            </div>
                          </div>
                        }
                      />
                      <div className={styles.projectItemContent}>
                        <span>{item.modifier || ''}</span>
                        {item.modifyTime && (
                          <span className={styles.datetime} title={item.updatedAt}>
                            {moment(item.modifyTime).format("YYYY-MM-DD")}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Card.Grid></Col>
                ))
                :
                <span style={obj}>暂无数据</span>
            }
          </Row>
        </Card>
      </div>
    )
  }
}

OrderList.defaultProps = {
  // notice: JSON.parse(`[{
  //   "type": 0,
  //   "orderStatus": 5,
  //   "goodsName": "能源",
  //   "companyName": "重庆浩生聚亿实业有限公司",
  //   "modifier": "结算专员_测试账号",
  //   "modifyTime": "2019-01-29 11:15:48"
  // }, {
  //   "type": 2,
  //   "orderStatus": 5,
  //   "goodsName": "油脂油料",
  //   "companyName": "五矿物流浙江有限公司",
  //   "modifier": "结算专员_测试账号",
  //   "modifyTime": "2019-01-29 10:14:41"
  // }, {
  //   "type": 1,
  //   "orderStatus": 1,
  //   "goodsName": "煤焦钢矿",
  //   "companyName": "余鸿泉",
  //   "modifier": "风控负责人_测试账号",
  //   "modifyTime": "2019-01-28 18:12:45"
  // }, {
  //   "type": 2,
  //   "orderStatus": 6,
  //   "goodsName": "油脂油料",
  //   "companyName": "余鸿泉",
  //   "modifier": "委托方_测试账号2",
  //   "modifyTime": "2019-01-28 17:11:14"
  // }, {
  //   "type": 0,
  //   "orderStatus": 10,
  //   "goodsName": "能源",
  //   "companyName": "重庆浩生聚亿实业有限公司",
  //   "modifier": "结算专员_测试账号",
  //   "modifyTime": "2019-01-28 14:30:39"
  // }, {
  //   "type": 0,
  //   "orderStatus": 6,
  //   "goodsName": "有色金属",
  //   "companyName": "五矿物流浙江有限公司",
  //   "modifier": "结算专员_测试账号",
  //   "modifyTime": "2019-01-25 20:12:52"
  // }]`)
}