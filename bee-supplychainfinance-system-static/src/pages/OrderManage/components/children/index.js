import { Component } from 'react';
import { Card, Divider, Form, Table, message, Button, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import withRouter from "umi/withRouter";
import router from 'umi/router';

@withRouter
@connect(({ detail, global }) => ({
  detail,
  global,
}))
export default class Index extends Component {
  componentDidMount() {
    const { id } = this.props.location.query
    const { dispatch } = this.props

    if (sessionStorage.businessMode === '1' || sessionStorage.businessMode === '4') {
      //获取发货单信息,只有委托销售,大企业委托采购才有
      dispatch({
        type: 'detail/getInvoice',
        payload: id,
        error: (msg) => {
          message.error('获取发货单信息失败：' + msg)
        }
      })
    }
  }

  showDetail = (order, num) => {
    const { id, enterType } = this.props.location.query
    const subOrderId = order.subSaleOrdersId || order.largeBuySubOrdersId
    router.push(`/orderManage/details/childDetails?enterType=${enterType}&num=${num}&id=${subOrderId}&orderId=${id}`)
  }

  render() {
    const { invoice } = this.props.detail;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {
            sessionStorage.businessMode === '1' ?
              <Card
                title={<div style={{ fontWeight: 600 }}>发货信息</div>}
                style={{ marginBottom: 10 }}
              >
                {
                  invoice && invoice.length > 0
                    ?
                    invoice.map((item, index) => {
                      return (
                        < div style={{ marginBottom: 20 }} key={index}>
                          <Card
                            type="inner"
                            size='small'
                            title={<div><span style={{ fontWeight: 700 }}>{item.subSaleOrdersName}</span><span style={{ marginLeft: 20 }}>{item.createTime}</span></div>}
                            extra={<Button type="primary" onClick={this.showDetail.bind(this, item, index + 1)}>查看详情</Button>}
                          >
                            <p
                              style={{
                                fontSize: 14,
                                color: item.orderStatus === 12 ? '#2FC25A' : '#0099FF',
                                marginBottom: 16,
                                fontWeight: 700,
                              }}
                            >
                              <span>状态：</span>
                              <span style={{ marginLeft: 10 }}>{
                                item.frozenStatus === 0 ? '冻结中' :
                                  item.orderStatus === 4 ? '委托企业开票' :
                                    item.orderStatus === 5 ? '支付货款' :
                                      item.orderStatus === 6 ? '采购商结算' :
                                        item.orderStatus === 7 ? '采购商回款' :
                                          item.orderStatus === 8 ? '委托方结算' :
                                            item.orderStatus === 9 ? '委托企业开尾票' :
                                              item.orderStatus === 10 ? '支付尾款' :
                                                item.orderStatus === 12 ? '已完成' :
                                                  null
                              }</span>
                            </p>
                            <div>
                              <div className={styles.submit}>支付货款：<span>{(item.paymentForGoods || item.paymentForGoods === 0) ? item.paymentForGoods + ' 元' : '无'}</span></div>
                              <div className={styles.submit}>委托企业发货数：<span>{(item.entrustDeliveryNumber || item.entrustDeliveryNumber === 0) ? item.entrustDeliveryNumber + ' 吨' : '无'}</span></div>
                              <div className={styles.submit}>购货商回款金额：<span>{(item.purchasePayAmount || item.purchasePayAmount === 0) ? item.purchasePayAmount + ' 元' : '无'}</span></div>
                              <div className={styles.submit}>付款时间：<span>{item.paymentDate ? item.paymentDate : '无'}</span></div>
                              <div className={styles.submit}>委托企业开票金额：<span>{(item.entrustInvoiceAmount || item.entrustInvoiceAmount === 0) ? item.entrustInvoiceAmount + ' 元' : '无'}</span></div>
                              <div className={styles.submit}>结算专员开票金额：<span>{(item.accountInvoiceAmount || item.accountInvoiceAmount === 0) ? item.accountInvoiceAmount + ' 元' : '无'}</span></div>
                            </div>
                          </Card>
                        </div>
                      )
                    })

                    :
                    <div className={styles.otherInfo}>
                      <div>
                        <Icon type="smile" />
                        <span style={{ marginLeft: 10 }}>暂无数据</span>
                      </div>
                    </div>
                }
              </Card>
              :
              <Card
                title={<div style={{ fontWeight: 600 }}>发货信息</div>}
                style={{ marginBottom: 10 }}
              >
                {
                  invoice && invoice.length > 0
                    ?
                    invoice.map((item, index) => {
                      return (
                        < div style={{ marginBottom: 20 }} key={index}>
                          <Card
                            type="inner"
                            size='small'
                            title={<div><span style={{ fontWeight: 700 }}>{item.largeBuySubOrdersName}</span><span style={{ marginLeft: 20 }}>{item.createTime}</span></div>}
                            extra={<Button type="primary" onClick={this.showDetail.bind(this, item, index + 1)}>查看详情</Button>}
                          >
                            <p
                              style={{
                                fontSize: 14,
                                color: item.orderStatus === 12 ? '#2FC25A' : '#0099FF',
                                marginBottom: 16,
                                fontWeight: 700,
                              }}
                            >
                              <span>状态：</span>
                              <span style={{ marginLeft: 10 }}>{
                                item.frozenStatus === 0 ? '冻结中' :
                                  item.orderStatus === 0 ? '支付货款' :
                                    item.orderStatus === 1 ? '结算确认' :
                                      item.orderStatus === 2 ? '委托企业回款' :
                                        item.orderStatus === 3 ? '开票收票' :
                                          item.orderStatus === 5 ? '已完成' :
                                            item.orderStatus === 6 ? '多退少补' :
                                              null
                              }</span>
                            </p>
                            <div>
                              <div className={styles.submit}>支付货款：<span>{(item.paymentForGoods || item.paymentForGoods === 0) ? item.paymentForGoods + ' 元' : '无'}</span></div>
                              <div className={styles.submit}>供货商发货数：<span>{(item.supplyDeliveryNumber || item.supplyDeliveryNumber === 0) ? item.supplyDeliveryNumber + ' 吨' : '无'}</span></div>
                              <div className={styles.submit}>委托企业回款金额：<span>{(item.entrustPayAmount || item.entrustPayAmount === 0) ? item.entrustPayAmount + ' 元' : '无'}</span></div>
                              <div className={styles.submit}>付款时间：<span>{item.paymentDate ? item.paymentDate : '无'}</span></div>
                              <div className={styles.submit}>供货商开票金额：<span>{(item.supplyInvoiceAmount || item.supplyInvoiceAmount === 0) ? item.supplyInvoiceAmount + ' 元' : '无'}</span></div>
                              <div className={styles.submit}>结算专员开票金额：<span>{(item.accountInvoiceAmount || item.accountInvoiceAmount === 0) ? item.accountInvoiceAmount + ' 元' : '无'}</span></div>
                            </div>
                          </Card>
                        </div>
                      )
                    })

                    :
                    <div className={styles.otherInfo}>
                      <div>
                        <Icon type="smile" />
                        <span style={{ marginLeft: 10 }}>暂无数据</span>
                      </div>
                    </div>
                }
              </Card>
          }
        </div>
      </div>
    )
  }
}