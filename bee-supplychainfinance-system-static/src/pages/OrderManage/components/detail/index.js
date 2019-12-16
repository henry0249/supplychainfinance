import React, { Component } from 'react';
import OtherInfo from './components/OtherInfo';
import { Card, Divider, Form, Table, message, Row, Col } from 'antd';
import { connect } from 'dva';
import withRouter from "umi/withRouter";
import styles from './index.less';

@withRouter
@Form.create()
@connect(({ detail, global }) => ({
  detail,
  global,
}))

//详情页面组件
export default class Index extends Component {
  state = {
    currentPage: 1,
    pageSize: 10,
    totalPage: 0,
    totalRecords: 0,
    params: {},
    orderInfo: {},
  }

  componentDidMount() {
    const { id } = this.props.location.query
    const { dispatch } = this.props
    //获取操作日志
    dispatch({
      type: 'detail/getLogs',
      payload: {
        url: `currentPage=1&orderId=${id}&pageSize=${10}`
      },
      success: (resp) => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
          })
        } else {
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        }
      }
    })

    //获取订单信息
    dispatch({
      type: 'detail/getOrderInfo',
      payload: id,
      error: (msg) => {
        message.error('获取订单详情失败：' + msg)
      }
    })
  }

  onChange = (current) => {
    const { id } = this.props.location.query
    const { dispatch } = this.props;
    const { pageSize, params } = this.state;
    dispatch({
      type: 'detail/getLogs',
      payload: {
        url: `currentPage=${current}&orderId=${id}&pageSize=${pageSize}`,
        params: params
      },
      success: (resp) => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
          })
        } else {
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        }
      }
    })

  }

  onShowSizeChange = (current, size) => {
    const { id } = this.props.location.query
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch({
      type: 'detail/getLogs',
      payload: {
        url: `currentPage=1&orderId=${id}&pageSize=${size}`,
        params: params
      },
      success: (resp) => {
        if (resp && resp.code === 0) {
          this.setState({
            ...resp.page
          })
        } else {
          this.setState({
            currentPage: 1,
            pageSize: 10,
            totalPage: 0,
            totalRecords: 0,
          })
        }
      }
    })
  }

  render() {
    const columns = [{
      title: '操作类型',
      dataIndex: 'operateType',
      key: 'operateType',
    }, {
      title: '操作人',
      dataIndex: 'creator',
      key: 'creator',
    }, {
      title: '执行结果',
      dataIndex: 'operateResult',
      key: 'operateResult',

    }, {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
    }]
    const { currentPage, pageSize, totalPage, totalRecords } = this.state
    const businessMode = JSON.parse(sessionStorage.getItem('businessMode'))
    const { roleId } = this.props.global.role
    const { orderInfo, logs, invoice } = this.props.detail
    return (
      businessMode === 0
        ?
        //委托采购
        <div className={styles.container}>
          <Card
            title={<div style={{ fontWeight: 600 }}>订单信息</div>}
            style={{ marginBottom: 10 }}
          >
            <Row>
              <Col span={8}>规格：<span>{orderInfo.specifications ? orderInfo.specifications : '无'}</span></Col>
              <Col span={8}>来源地：<span>{orderInfo.sourceArea ? orderInfo.sourceArea : '无'}</span></Col>
              <Col span={8}>质量标准：<span>{(orderInfo.grade || orderInfo.grade === 0) ? orderInfo.grade : '无'}</span></Col>
              <Col span={8}>数量：<span>{(orderInfo.quantity || orderInfo.quantity === 0) ? orderInfo.quantity + " 吨" : '无'}</span></Col>
              <Col span={8}>委托采购价格：<span>{(orderInfo.purchasingPrice || orderInfo.purchasingPrice === 0) ? orderInfo.purchasingPrice + ' 元' : '无'}</span></Col>
              <Col span={8}>销售价格：<span>{(orderInfo.sellingPrice || orderInfo.sellingPrice === 0) ? orderInfo.sellingPrice + ' 元' : '无'}</span></Col>
            </Row>
            <Divider />
            <Row>
              <Col span={8}>担保企业：<span>{orderInfo.guarantorName ? orderInfo.guarantorName : '无'}</span></Col>
              <Col span={8}>保证金比例：<span>{(orderInfo.marginRates || orderInfo.marginRates === 0) ? orderInfo.marginRates + '%' : '无'}</span></Col>
            </Row>
            <Divider />
            <Row>
              <Col span={8}>开票模式：<span>{(orderInfo.invoiceMode || orderInfo.invoiceMode === 0) ? (orderInfo.invoiceMode === 1 ? '开一定比例票后结算' : '结算后统一开票') : '无'}</span></Col>
              <Col span={8}>首次开票比例：<span>{(orderInfo.firstInvoiceRatio || orderInfo.firstInvoiceRatio === 0) ? orderInfo.firstInvoiceRatio + '%' : '无'}</span></Col>
              <Col span={8}>开票时限：<span>{orderInfo.invoiceDeadline ? orderInfo.invoiceDeadline + ' 天' : '无'}</span></Col>
              <Col span={8}>付款比例：<span>{(orderInfo.paymentRatio || orderInfo.paymentRatio === 0) ? orderInfo.paymentRatio + '%' : ''}</span></Col>
              <Col span={8}>提货期限：<span>{orderInfo.takeGoodsDeadline ? orderInfo.takeGoodsDeadline + ' 天' : '无'}</span></Col>
              <Col span={8}>货权转移期限：<span>{orderInfo.goodsTransferDeadline ? orderInfo.goodsTransferDeadline + ' 天' : '无'}</span></Col>
            </Row>
            <Divider />
            <Row>
              <Col span={8}>货代公司：<span>{orderInfo.freightForwardCompanyName ? orderInfo.freightForwardCompanyName : '无'}</span></Col>
              <Col span={8}>发货地：<span>{orderInfo.deliveryAddressName ? orderInfo.deliveryAddressName : '无'}</span></Col>
              <Col span={8}>发货库位/港口：<span>{orderInfo.deliveryPlace ? orderInfo.deliveryPlace : '无'}</span></Col>
              <Col span={8}>收货地：<span>{orderInfo.takeGoodsAddressName ? orderInfo.takeGoodsAddressName : '无'}</span></Col>
              <Col span={8}>收货库位/港口：<span>{orderInfo.takeGoodsPlace ? orderInfo.takeGoodsPlace : '无'}</span></Col>
              <Col span={8}>交割库位/港口：<span>{orderInfo.transactionPlace ? orderInfo.transactionPlace : '无'}</span></Col>
            </Row>
            <Divider />
            <Row>
              <Col span={8}>年化利率：<span>{(orderInfo.annualRate || orderInfo.annualRate === 0) ? orderInfo.annualRate + '%' : '无'}</span></Col>
              <Col span={8}>资金占用天数：<span>{(orderInfo.capitalOccupationDays || orderInfo.capitalOccupationDays === 0) ? orderInfo.capitalOccupationDays + '天' : '无'}</span></Col>
              <Col span={8}>货物数量正负比例：<span>{(orderInfo.goodsPlusMinusRatio || orderInfo.goodsPlusMinusRatio === 0) ? orderInfo.goodsPlusMinusRatio + '%' : '无'}</span></Col>
              <Col span={8}>付款(运输)条款：<span>{(orderInfo.paymentProvision || orderInfo.paymentProvision === 0) ? (orderInfo.paymentProvision === 1 ? '先款后货' : '先货后款') : '无'}</span></Col>
            </Row>
          </Card>
          <Card
            title={<div style={{ fontWeight: 600 }}>其他补充信息</div>}
            style={{ marginBottom: 10 }}
          >
            <OtherInfo data={orderInfo.additionalInformation ? orderInfo.additionalInformation : ''} />
          </Card>
          <Card
            title={<div style={{ fontWeight: 600 }}>物流信息</div>}
            style={{ marginBottom: 10 }}
          >
            <Row>
              <Col span={8}>已发货数量：<span>{(orderInfo.deliveredNumber || orderInfo.deliveredNumber === 0) ? orderInfo.deliveredNumber + '吨' : '无'}</span></Col>
              <Col span={8}>未发货数量：<span>{(orderInfo.undeliveredNumber || orderInfo.undeliveredNumber === 0) ? orderInfo.undeliveredNumber + '吨' : '无'}</span></Col>
              <Col span={8}>已到货数量：<span>{(orderInfo.receivedNumber || orderInfo.receivedNumber === 0) ? orderInfo.receivedNumber + '吨' : '无'}</span></Col>
              <Col span={8}>货物所在地：<span>{orderInfo.productLoc ? orderInfo.productLoc : '无'}</span></Col>
            </Row>
          </Card>
          {
            roleId === 1 || roleId === 2 || roleId === 3
              ?
              null
              :
              <Card
                title={<div style={{ color: '#1890FF' }}>操作日志</div>}
              >
                <Table
                  style={{ marginTop: '30px' }}
                  columns={columns}
                  dataSource={logs}
                  rowKey={(i, index) => index}
                  pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    defaultCurrent: 1,
                    defaultPageSize: 10,
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalRecords,
                    onChange: this.onChange.bind(this),
                    pageSizeOptions: ["10", "20", "30"],
                    showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
                    onShowSizeChange: this.onShowSizeChange.bind(this)
                  }}
                />
              </Card>
          }
        </div>
        :
        businessMode === 1
          ?
          //委托销售
          <div className={styles.container}>
            <Card
              title={<div style={{ fontWeight: 600 }}>订单信息</div>}
              style={{ marginBottom: 10 }}
            >
              <Row>
                <Col span={8}>规格：<span>{orderInfo.specifications ? orderInfo.specifications : '无'}</span></Col>
                <Col span={8}>来源地：<span>{orderInfo.sourceArea ? orderInfo.sourceArea : '无'}</span></Col>
                <Col span={8}>质量标准：<span>{(orderInfo.grade || orderInfo.grade === 0) ? orderInfo.grade : '无'}</span></Col>
                <Col span={8}>数量：<span>{(orderInfo.quantity || orderInfo.quantity === 0) ? orderInfo.quantity + ' 吨' : '无'}</span></Col>
                <Col span={8}>委托销售价格：<span>{(orderInfo.purchasingPrice || orderInfo.purchasingPrice === 0) ? orderInfo.purchasingPrice + ' 元' : '无'}</span></Col>
                <Col span={8}>采购价格：<span>{(orderInfo.purchasePrice || orderInfo.purchasePrice === 0) ? orderInfo.purchasePrice + ' 元' : '无'}</span></Col>
              </Row>
              <Divider />
              <Row>
                <Col span={8}>担保企业：<span>{orderInfo.guarantorName ? orderInfo.guarantorName : '无'}</span></Col>
              </Row>
              <Divider />
              <Row>
                <Col span={8}>开票模式：<span>{(orderInfo.invoiceMode || orderInfo.invoiceMode === 0) ? (orderInfo.invoiceMode == 1 ? '开一定比例票后结算' : '结算后统一开票') : '无'}</span></Col>
                <Col span={8}>首次开票比例：<span>{(orderInfo.firstInvoiceRatio || orderInfo.firstInvoiceRatio === 0) ? orderInfo.firstInvoiceRatio + '%' : '无'}</span></Col>
                <Col span={8}>开票时限：<span>{orderInfo.invoiceDeadline ? orderInfo.invoiceDeadline + ' 天' : '无'}</span></Col>
                <Col span={8}>付款比例：<span>{(orderInfo.paymentRatio || orderInfo.paymentRatio === 0) ? orderInfo.paymentRatio + '%' : '无'}</span></Col>
                <Col span={8}>购货方支付方式：<span>{(orderInfo.paymentMode || orderInfo.paymentMode === 0) ? (orderInfo.paymentMode > 1 ? (orderInfo.paymentMode === 2 ? '承兑' : '现金或承兑') : '现金') : '无'}</span></Col>
              </Row>
              <Divider />
              <Row>
                <Col span={8}>货代公司：<span>{orderInfo.freightForwardCompanyName ? orderInfo.freightForwardCompanyName : '无'}</span></Col>
                <Col span={8}>物流运输方式：<span>{(orderInfo.logisticsMode || orderInfo.logisticsMode === 0) ? (orderInfo.logisticsMode > 1 ? (orderInfo.logisticsMode == 2 ? '汽运' : '铁运') : '船运') : '无'}</span></Col>
                <Col span={8}>付款(运输)条款：<span>{(orderInfo.paymentProvision || orderInfo.paymentProvision === 0) ? (orderInfo.paymentProvision === 1 ? '委托企业提交榜单化验单后付款' : '购货企业提交榜单化验单后付款') : '无'}</span></Col>
                <Col span={8}>最迟回款时间：<span>{orderInfo.latestPaymentTime ? orderInfo.latestPaymentTime : '无'}</span></Col>
                <Col span={8}>结算比例：<span>{(orderInfo.settlementRatio || orderInfo.settlementRatio === 0) ? orderInfo.settlementRatio + '%' : '无'}</span></Col>
                <Col span={8}>购货商一票结算时限：<span>{orderInfo.settlementDeadline ? orderInfo.settlementDeadline + '天' : '无'}</span></Col>
              </Row>
              <Divider />
              <Row>
                <Col span={8}>年化利率：<span>{(orderInfo.annualRate || orderInfo.annualRate === 0) ? orderInfo.annualRate + '%' : '无'}</span></Col>
                <Col span={8}>资金占用天数：<span>{(orderInfo.capitalOccupationDays || orderInfo.capitalOccupationDays === 0) ? orderInfo.capitalOccupationDays + '天' : '无'}</span></Col>
              </Row>
            </Card>
            <Card
              title={<div style={{ fontWeight: 600 }}>其他补充信息</div>}
              style={{ marginBottom: 10 }}
            >
              <OtherInfo data={orderInfo.additionalInformation ? orderInfo.additionalInformation : ''} />
            </Card>
            <Card
              title={<div style={{ fontWeight: 600 }}>物流信息</div>}
              style={{ marginBottom: 10 }}
            >
              <Row>
                <Col span={8}>已发货数量：<span>{(orderInfo.deliveredNumber || orderInfo.deliveredNumber === 0) ? orderInfo.deliveredNumber + '吨' : '无'}</span></Col>
                <Col span={8}>未发货数量：<span>{(orderInfo.undeliveredNumber || orderInfo.undeliveredNumber === 0) ? orderInfo.undeliveredNumber + '吨' : '无'}</span></Col>
                <Col span={8}>已到货数量：<span>{(orderInfo.receivedNumber || orderInfo.receivedNumber === 0) ? orderInfo.receivedNumber + '吨' : '无'}</span></Col>
                <Col span={8}>货物所在地：<span>{orderInfo.productLoc ? orderInfo.productLoc : '无'}</span></Col>
              </Row>
            </Card>
            {
              roleId === 1 || roleId === 2 || roleId === 3
                ?
                null
                :
                <Card
                  title={<div style={{ color: '#1890FF' }}>操作日志</div>}
                >
                  <Table
                    style={{ marginTop: '30px' }}
                    columns={columns}
                    dataSource={logs}
                    rowKey={(i, index) => index}
                    pagination={{
                      showQuickJumper: true,
                      showSizeChanger: true,
                      defaultCurrent: 1,
                      defaultPageSize: 10,
                      current: currentPage,
                      pageSize: pageSize,
                      total: totalRecords,
                      onChange: this.onChange.bind(this),
                      pageSizeOptions: ["10", "20", "30"],
                      showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
                      onShowSizeChange: this.onShowSizeChange.bind(this)
                    }}
                  />
                </Card>
            }
          </div >
          :
          businessMode === 2
            ?
            //金融仓储
            <div className={styles.container}>
              <Card
                title={<div style={{ fontWeight: 600 }}>订单信息</div>}
                style={{ marginBottom: 10 }}
              >
                <Row>
                  <Col span={8}>规格：<span>{orderInfo.specifications ? orderInfo.specifications : '无'}</span></Col>
                  <Col span={8}>来源地：<span>{orderInfo.sourceArea ? orderInfo.sourceArea : '无'}</span></Col>
                  <Col span={8}>质量标准：<span>{(orderInfo.grade || orderInfo.grade === 0) ? orderInfo.grade : '无'}</span></Col>
                  <Col span={8}>数量：<span>{(orderInfo.quantity || orderInfo.quantity === 0) ? orderInfo.quantity + " 吨" : '无'}</span></Col>
                  <Col span={8}>单价：<span>{(orderInfo.unitPrice || orderInfo.unitPrice === 0) ? orderInfo.unitPrice + ' 元' : '无'}</span></Col>
                  <Col span={8}>质押比例：<span>{(orderInfo.pledgeRatio || orderInfo.pledgeRatio === 0) ? orderInfo.pledgeRatio + '%' : '无'}</span></Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={8}>担保企业：<span>{orderInfo.guarantorName ? orderInfo.guarantorName : '无'}</span></Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={8}>货代公司：<span>{orderInfo.freightForwardCompanyName ? orderInfo.freightForwardCompanyName : '无'}</span></Col>
                  <Col span={8}>委托企业付款方式：<span>{(orderInfo.paymentMode || orderInfo.paymentMode === 0) ? (orderInfo.paymentMode === 1 ? '现金' : orderInfo.paymentMode === 2 ? '承兑' : '现金或承兑') : '无'}</span></Col>
                  <Col span={8}>最晚提货日期：<span>{orderInfo.latestDeliveryDate ? orderInfo.latestDeliveryDate : '无'}</span></Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={8}>年化利率：<span>{(orderInfo.annualRate || orderInfo.annualRate === 0) ? orderInfo.annualRate + '%' : '无'}</span></Col>
                  <Col span={8}>资金占用天数：<span>{(orderInfo.capitalOccupationDays || orderInfo.capitalOccupationDays === 0) ? orderInfo.capitalOccupationDays + '天' : '无'}</span></Col>
                </Row>
              </Card>
              <Card
                title={<div style={{ fontWeight: 600 }}>其他补充信息</div>}
                style={{ marginBottom: 10 }}
              >
                <OtherInfo data={orderInfo.additionalInformation ? orderInfo.additionalInformation : ''} />
              </Card>
              {
                roleId === 1 || roleId === 2 || roleId === 3
                  ?
                  null
                  :
                  <Card
                    title={<div style={{ color: '#1890FF' }}>操作日志</div>}
                  >
                    <Table
                      style={{ marginTop: '30px' }}
                      columns={columns}
                      dataSource={logs}
                      rowKey={(i, index) => index}
                      pagination={{
                        showQuickJumper: true,
                        showSizeChanger: true,
                        defaultCurrent: 1,
                        defaultPageSize: 10,
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalRecords,
                        onChange: this.onChange.bind(this),
                        pageSizeOptions: ["10", "20", "30"],
                        showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
                        onShowSizeChange: this.onShowSizeChange.bind(this)
                      }}
                    />
                  </Card>
              }
            </div>
            :
            //大委托采购
            <div className={styles.container}>
              <Card
                title={<div style={{ fontWeight: 600 }}>订单信息</div>}
                style={{ marginBottom: 10 }}
              >
                <Row>
                  <Col span={8}>规格：<span>{orderInfo.specifications ? orderInfo.specifications : '无'}</span></Col>
                  <Col span={8}>来源地：<span>{orderInfo.sourceArea ? orderInfo.sourceArea : '无'}</span></Col>
                  <Col span={8}>质量标准：<span>{(orderInfo.grade || orderInfo.grade === 0) ? orderInfo.grade : '无'}</span></Col>
                  <Col span={8}>数量：<span>{(orderInfo.quantity || orderInfo.quantity === 0) ? orderInfo.quantity + " 吨" : '无'}</span></Col>
                  <Col span={8}>委托采购价格：<span>{(orderInfo.purchasingPrice || orderInfo.purchasingPrice === 0) ? orderInfo.purchasingPrice + ' 元' : '无'}</span></Col>
                  <Col span={8}>销售价格：<span>{(orderInfo.sellingPrice || orderInfo.sellingPrice === 0) ? orderInfo.sellingPrice + ' 元' : '无'}</span></Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={8}>担保企业：<span>{orderInfo.guarantorName ? orderInfo.guarantorName : '无'}</span></Col>
                  <Col span={8}>保证金比例：<span>{(orderInfo.marginRates || orderInfo.marginRates === 0) ? orderInfo.marginRates + '%' : '无'}</span></Col>
                  <Col span={8}>货物交割类型：<span>{orderInfo.deliveryType === 1 ? '现货交易' : orderInfo.deliveryType === 2 ? '期货交易' : '无'}</span></Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={8}>开票时限：<span>{orderInfo.invoiceDeadline ? orderInfo.invoiceDeadline + ' 天' : '无'}</span></Col>
                  <Col span={8}>付款比例：<span>{(orderInfo.paymentRatio || orderInfo.paymentRatio === 0) ? orderInfo.paymentRatio + '%' : ''}</span></Col>
                  <Col span={8}>委托企业回款期限：<span>{orderInfo.clientCollectionDeadline ? orderInfo.clientCollectionDeadline + ' 天' : '无'}</span></Col>
                  <Col span={8}>货权转移期限：<span>{orderInfo.goodsTransferDeadline ? orderInfo.goodsTransferDeadline + ' 天' : '无'}</span></Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={8}>货代公司：<span>{orderInfo.freightForwardCompanyName ? orderInfo.freightForwardCompanyName : '无'}</span></Col>
                  <Col span={8}>发货地：<span>{orderInfo.deliveryAddressName ? orderInfo.deliveryAddressName : '无'}</span></Col>
                  <Col span={8}>发货库位/港口：<span>{orderInfo.deliveryPlace ? orderInfo.deliveryPlace : '无'}</span></Col>
                  <Col span={8}>收货地：<span>{orderInfo.takeGoodsAddressName ? orderInfo.takeGoodsAddressName : '无'}</span></Col>
                  <Col span={8}>收货库位/港口：<span>{orderInfo.takeGoodsPlace ? orderInfo.takeGoodsPlace : '无'}</span></Col>
                  <Col span={8}>交割库位/港口：<span>{orderInfo.transactionPlace ? orderInfo.transactionPlace : '无'}</span></Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={8}>年化利率：<span>{(orderInfo.annualRate || orderInfo.annualRate === 0) ? orderInfo.annualRate + '%' : '无'}</span></Col>
                  <Col span={8}>资金占用天数：<span>{(orderInfo.capitalOccupationDays || orderInfo.capitalOccupationDays === 0) ? orderInfo.capitalOccupationDays + '天' : '无'}</span></Col>
                  <Col span={8}>货物数量正负比例：<span>{(orderInfo.goodsPlusMinusRatio || orderInfo.goodsPlusMinusRatio === 0) ? orderInfo.goodsPlusMinusRatio + '%' : '无'}</span></Col>
                </Row>
              </Card>
              <Card
                title={<div style={{ fontWeight: 600 }}>其他补充信息</div>}
                style={{ marginBottom: 10 }}
              >
                <OtherInfo data={orderInfo.additionalInformation ? orderInfo.additionalInformation : ''} />
              </Card>
              <Card
                title={<div style={{ fontWeight: 600 }}>物流信息</div>}
                style={{ marginBottom: 10 }}
              >
                <Row>
                  <Col span={8}>已发货数量：<span>{(orderInfo.deliveredNumber || orderInfo.deliveredNumber === 0) ? orderInfo.deliveredNumber + '吨' : '无'}</span></Col>
                  <Col span={8}>未发货数量：<span>{(orderInfo.undeliveredNumber || orderInfo.undeliveredNumber === 0) ? orderInfo.undeliveredNumber + '吨' : '无'}</span></Col>
                  <Col span={8}>已到货数量：<span>{(orderInfo.receivedNumber || orderInfo.receivedNumber === 0) ? orderInfo.receivedNumber + '吨' : '无'}</span></Col>
                  <Col span={8}>货物所在地：<span>{orderInfo.productLoc ? orderInfo.productLoc : '无'}</span></Col>
                </Row>
              </Card>
              {
                roleId === 1 || roleId === 2 || roleId === 3
                  ?
                  null
                  :
                  <Card
                    title={<div style={{ color: '#1890FF' }}>操作日志</div>}
                  >
                    <Table
                      style={{ marginTop: '30px' }}
                      columns={columns}
                      dataSource={logs}
                      rowKey={(i, index) => index}
                      pagination={{
                        showQuickJumper: true,
                        showSizeChanger: true,
                        defaultCurrent: 1,
                        defaultPageSize: 10,
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalRecords,
                        onChange: this.onChange.bind(this),
                        pageSizeOptions: ["10", "20", "30"],
                        showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
                        onShowSizeChange: this.onShowSizeChange.bind(this)
                      }}
                    />
                  </Card>
              }
            </div>
    )
  }
}
