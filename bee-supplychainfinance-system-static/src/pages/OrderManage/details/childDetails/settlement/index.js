import React, { Component } from 'react';
import styles from './index.less';
import { Button, message, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from "umi/withRouter";

@withRouter
@connect(({ global, detail, settlement, loading }) => ({
  global,
  detail,
  settlement,
  loading: loading.effects
}))
export default class Index extends Component {
  state = {
    saleConfirm: null, //0可修改 1等待其它方确认 2已双方确认
    buyConfirm: null, //0可修改 1等待其它方确认 2已双方确认
  }

  componentDidMount() {
    this.getData();
  }

  getData = (refresh) => {
    const { dispatch } = this.props;
    const orderId = this.props.location.query.id || '0';
    if (refresh) {
      //获取子订单信息
      dispatch({
        type: 'detail/getChildOrderInfo',
        payload: orderId,
        success: (res) => {
          if (res.data.type === 4 && res.data.orderStatus === 0) {
            dispatch({
              type: 'check/queryPay',
              payload: orderId,
              error: (msg) => {
                message.error(`查询委托付款函确认情况失败：` + msg)
              }
            })
          }
        },
        error: (msg) => {
          message.error('获取订单详情失败：' + msg)
        }
      })
    }
    // 获取结算单
    dispatch({
      type: 'settlement/getInfo',
      payload: orderId,
      success: (data) => {
        Object.keys(data).forEach(key => {
          if (Object.keys(data[key]).length !== 0) {
            let url = sessionStorage.businessMode === '1' ? `orderId=${orderId}&accountType=${data[key].accountType}&saleAccountsId=${data[key].saleAccountsId}`
              : `largeSubOrderId=${orderId}&accountType=${data[key].accountType}&largeBuyAccountsId=${data[key].largeBuyAccountsId}`;
            dispatch({
              type: 'settlement/getsituation',
              payload: url,
              success: (d) => {
                if (d.accountType === 0) {
                  this.setState({
                    saleConfirm: d.confirmStatus,
                  })
                } else {
                  this.setState({
                    buyConfirm: d.confirmStatus,
                  })
                }
              },
              error: (msg) => {
                message.error('获取结算单确认情况失败：' + msg);
              }
            })
          }
        })
      },
      error: (msg) => {
        message.error('获取结算信息失败：' + msg)
      }
    })
    // 获取退回结算单
    dispatch({
      type: 'settlement/getRefused',
      payload: orderId,
      error: (msg) => {
        message.error('获取退回结算单信息失败：' + msg)
      }
    })
  }

  confirm = (accountType, accountsId) => {
    const { dispatch } = this.props;
    const orderId = this.props.location.query.id || '0';

    let params = sessionStorage.businessMode === '1' ? {
      orderId, // 订单信息表业务主键id
      accountType, // 结算单类型（0.销售结算 1.采购结算）
      saleAccountsId: accountsId
    } : {
        accountType,
        largeSubOrderId: orderId,
        largeBuyAccountsId: accountsId
      }

    dispatch({
      type: 'settlement/confirm',
      payload: params,
      success: () => {
        this.getData(true);
        message.success('确认结算单成功')
      },
      error: (msg) => {
        message.error('确认结算单失败：' + msg)
      }
    })
  }

  handleJump = (accountType, accountsId) => {
    sessionStorage.setItem('orderDetailUrl', this.props.location.pathname + this.props.location.search);
    const { orderChildInfo } = this.props.detail;
    let orderId = orderChildInfo.subSaleOrdersId || orderChildInfo.largeBuySubOrdersId;
    if (accountsId) {
      router.push(`/orderManage/settlement/edit?accountType=${accountType}&orderId=${orderId}&accountsId=${accountsId}`)
    } else {
      router.push(`/orderManage/settlement/edit?accountType=${accountType}&orderId=${orderId}`)
    }
  }

  render() {
    const { role } = this.props.global;
    const { orderChildInfo } = this.props.detail;
    const { data, refused } = this.props.settlement;
    const { saleConfirm, buyConfirm } = this.state;
    return (
      <div className={styles.container}>
        {
          refused.accountsRefusedDTO && Object.keys(refused.accountsRefusedDTO).length !== 0 && <div className={styles.backInfo}>
            <Icon type="exclamation-circle" style={{ color: '#FAAD14', fontSize: 24 }} />
            <div className={styles.detailsBox}>
              <span style={{ fontSize: 16 }}>该订单的结算单被退回！</span>
              <div className={styles.details}>
                <span>退回原因：</span>
                <div className={styles.text}>
                  <pre>{refused.accountsRefusedDTO.recentlyReason ? refused.accountsRefusedDTO.recentlyReason : '无'}</pre>
                </div>
              </div>
            </div>
          </div>
        }
        {
          Object.keys(data).length !== 0 ? Object.keys(data).map(key => {
            let receipt = 0, bNum = 0, inPrice = 0, noTax = 0;
            let shipNum = 0, receiptNum = 0, deduct1 = 0, deduct2 = 0, settleNum = 0, diff = 0;
            if (Object.keys(data[key]).length !== 0) {

              data[key].collectionInvoicesAlready.forEach(item => {
                if (!isNaN(item.collectionAmount)) receipt += parseFloat(item.collectionAmount || 0);
                if (!isNaN(item.invoiceQuality)) bNum += parseFloat(item.invoiceQuality || 0);
                if (!isNaN(item.issuedInvoiceAmount)) inPrice += parseFloat(item.issuedInvoiceAmount || 0);
                if (!isNaN(item.taxExclusiveAmount)) noTax += parseFloat(item.taxExclusiveAmount || 0);
              })
              data[key].collectionInvoicesNot.forEach(item => {
                if (!isNaN(item.collectionAmount)) receipt += parseFloat(item.collectionAmount || 0);
                if (!isNaN(item.invoiceQuality)) bNum += parseFloat(item.invoiceQuality || 0);
                if (!isNaN(item.issuedInvoiceAmount)) inPrice += parseFloat(item.issuedInvoiceAmount || 0);
                if (!isNaN(item.taxExclusiveAmount)) noTax += parseFloat(item.taxExclusiveAmount || 0);
              })
              return (
                <div className={styles.cardBox} key={key}>
                  <span className={styles.title}>{
                    key === 'sale' ? (
                      role.roleId === 1 || role.roleId === 2 ? '采购结算' : '销售结算'
                    ) : (
                        role.roleId === 1 || role.roleId === 2 ? '销售结算' : '采购结算'
                      )
                  }</span>

                  <div className={styles.content}>
                    {
                      // 判断子订单是否冻结
                      orderChildInfo.frozenStatus !== 0 ? (
                        // 结算单类型 销售或者采购
                        key === 'sale' ?
                          (
                            // 销售结算单确认状态 0：未确认 1：已确认
                            saleConfirm === 0 ?
                              (
                                // 销售结算单未确认时
                                sessionStorage.businessMode === '1' ? (
                                  // 业务类型为销售时
                                  role.roleId === 2 ?
                                    <div className={styles.btnBox}>
                                      <Button onClick={this.handleJump.bind(this, data[key].accountType, data[key].saleAccountsId)}>进入编辑</Button>
                                      <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>未确认结算</Button>
                                    </div> :
                                    role.roleId === 10 ?
                                      <div className={styles.btnBox}>
                                        <Button onClick={this.handleJump.bind(this, data[key].accountType, data[key].saleAccountsId)}>进入编辑</Button>
                                        <Button style={{ marginLeft: 10 }} type="primary" onClick={this.confirm.bind(this, data[key].accountType, data[key].saleAccountsId)}>确认结算</Button>
                                      </div> :
                                      null
                                ) : (
                                    // 大企业采购
                                    role.roleId === 1 || role.roleId === 10 ?
                                      <div className={styles.btnBox}>
                                        <Button onClick={this.handleJump.bind(this, data[key].accountType, data[key].largeBuyAccountsId)}>进入编辑</Button>
                                        <Button style={{ marginLeft: 10 }} type="primary" onClick={this.confirm.bind(this, data[key].accountType, data[key].largeBuyAccountsId)}>确认结算</Button>
                                      </div> : null
                                  )
                              )
                              :
                              (
                                // 销售结算单已确认时
                                sessionStorage.businessMode === '1' ? (
                                  // 业务类型为销售时
                                  role.roleId === 2 ?
                                    <div className={styles.btnBox}>
                                      <Button disabled={true}>已编辑</Button>
                                      <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>已确认结算</Button>
                                    </div> :
                                    role.roleId === 10 ?
                                      <div className={styles.btnBox}>
                                        <Button disabled={true}>已编辑</Button>
                                        <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>已确认结算</Button>
                                      </div> :
                                      null
                                ) : (
                                    // 大企业采购
                                    role.roleId === 1 || role.roleId === 10 ?
                                      <div className={styles.btnBox}>
                                        <Button disabled={true}>已编辑</Button>
                                        <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>已确认结算</Button>
                                      </div> : null
                                  )
                              )
                          )
                          :
                          (
                            buyConfirm === 0 ?
                              (
                                // 采购结算单未确认时
                                sessionStorage.businessMode === '1' ? (
                                  role.roleId === 1 || role.roleId === 10 ?
                                    <div className={styles.btnBox}>
                                      <Button onClick={this.handleJump.bind(this, data[key].accountType, data[key].saleAccountsId)}>进入编辑</Button>
                                      <Button style={{ marginLeft: 10 }} type="primary" onClick={this.confirm.bind(this, data[key].accountType, data[key].saleAccountsId)}>确认结算</Button>
                                    </div> : null
                                ) : (
                                    role.roleId === 2 ?
                                      <div className={styles.btnBox}>
                                        <Button onClick={this.handleJump.bind(this, data[key].accountType, data[key].largeBuyAccountsId)}>进入编辑</Button>
                                        <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>未确认结算</Button>
                                      </div> :
                                      role.roleId === 10 ?
                                        <div className={styles.btnBox}>
                                          <Button onClick={this.handleJump.bind(this, data[key].accountType, data[key].largeBuyAccountsId)}>进入编辑</Button>
                                          <Button style={{ marginLeft: 10 }} type="primary" onClick={this.confirm.bind(this, data[key].accountType, data[key].largeBuyAccountsId)}>确认结算</Button>
                                        </div> :
                                        null
                                  )
                              )
                              :
                              (
                                // 采购结算单已确认时
                                sessionStorage.businessMode === '1' ? (
                                  role.roleId === 1 || role.roleId === 10 ?
                                    <div className={styles.btnBox}>
                                      <Button disabled={true}>已编辑</Button>
                                      <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>已确认结算</Button>
                                    </div> : null
                                ) : (
                                    role.roleId === 2 ?
                                      <div className={styles.btnBox}>
                                        <Button disabled={true}>已编辑</Button>
                                        <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>已确认结算</Button>
                                      </div> :
                                      role.roleId === 10 ?
                                        <div className={styles.btnBox}>
                                          <Button disabled={true}>已编辑</Button>
                                          <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>已确认结算</Button>
                                        </div> :
                                        null
                                  )
                              )
                          )
                      ) : null
                    }
                    <div className={styles.itemBox}>
                      <span className={styles.header}>{
                        key === 'sale' ? (
                          role.roleId === 1 || role.roleId === 2 ? '付款时间及发票收取情况' : '收款时间及发票开具情况'
                        ) : (
                            role.roleId === 1 || role.roleId === 2 ? '收款时间及发票开具情况' : '付款时间及发票收取情况'
                          )
                      }</span>
                      <div className={styles.table}>
                        <div className={styles.row}>
                          <span>日期</span>
                          <span>说明</span>
                          <span>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '已付款' : '已收款'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '已收款' : '已付款'
                              )
                          }</span>
                          <span>开票日期</span>
                          <span>开票数量</span>
                          <span>结算单价</span>
                          <span>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '已收取进项发票' : '已开具发票金额'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '已开具发票金额' : '已收取进项发票'
                              )
                          }</span>
                          <span>不含税金额</span>
                          <span>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
                              )
                          }</span>
                        </div>
                        {
                          data[key].collectionInvoicesAlready.map((item, index) =>
                            <div className={styles.row} key={index}>
                              <span>{item.collectionTime}</span>
                              <span>{item.explaining}</span>
                              <span>{item.collectionAmount}</span>
                              <span>{item.invoiceTime}</span>
                              <span>{item.invoiceQuality}</span>
                              <span>{item.acountUnitPrice}</span>
                              <span>{item.issuedInvoiceAmount}</span>
                              <span>{item.taxExclusiveAmount}</span>
                              <span>{item.collectionMethod}</span>
                            </div>
                          )
                        }
                        <div className={styles.row} style={{ marginTop: 10 }}>
                          <span></span>
                          <span>说明</span>
                          <span>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '应付款' : '应收款'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '应收款' : '应付款'
                              )
                          }</span>
                          <span></span>
                          <span>开票数量</span>
                          <span>结算单价</span>
                          <span>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '应收取进项发票' : '应开具发票金额'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '应开具发票金额' : '应收取进项发票'
                              )
                          }</span>
                          <span>不含税金额</span>
                          <span>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
                              )
                          }</span>
                        </div>
                        {
                          data[key].collectionInvoicesNot.map((item, index) =>
                            <div className={styles.row} key={index}>
                              <span></span>
                              <span>{item.explaining}</span>
                              <span>{item.collectionAmount}</span>
                              <span></span>
                              <span>{item.invoiceQuality}</span>
                              <span>{item.acountUnitPrice}</span>
                              <span>{item.issuedInvoiceAmount}</span>
                              <span>{item.taxExclusiveAmount}</span>
                              <span>{item.collectionMethod}</span>
                            </div>
                          )
                        }
                        <div className={styles.totle}>
                          <span>合计</span>
                          <span></span>
                          <span>{(receipt).toFixed(3)}</span>
                          <span></span>
                          <span>{(bNum).toFixed(3)}</span>
                          <span>{bNum !== 0 ? (inPrice / bNum).toFixed(3) : 0}</span>
                          <span>{(inPrice).toFixed(3)}</span>
                          <span>{(noTax).toFixed(3)}</span>
                          <span></span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.itemBox}>
                      <span className={styles.header}>产品结算情况</span>
                      <div className={styles.table}>
                        <div className={styles.row}>
                          <span>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '收货时间' : '发货时间'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '发货时间' : '收货时间'
                              )
                          }</span>
                          <span>发货数量</span>
                          <span>收货数量</span>
                          <span>扣渣</span>
                          <span>扣水</span>
                          <span>其他</span>
                          <span>结算数量</span>
                          <span>数量差异</span>
                          <span>运输方式</span>
                        </div>
                        {
                          data[key].productAccounts.map((item, index) =>
                            <div className={styles.row} key={index}>
                              <span>{item.deliveryTime}</span>
                              <span>{item.deliveryQuantity}</span>
                              <span>{item.receivingQuality}</span>
                              <span>{item.deductSlag}</span>
                              <span>{item.deductWater}</span>
                              <span>{item.remark}</span>
                              <span>{item.accountQuantity}</span>
                              <span>{item.quantityDifference}</span>
                              <span>{item.transportMethod}</span>
                            </div>
                          )
                        }
                        {
                          data[key].productAccounts.map((item, index) => {
                            if (!isNaN(item.deliveryQuantity)) shipNum += parseFloat(item.deliveryQuantity || 0);
                            if (!isNaN(item.receivingQuality)) receiptNum += parseFloat(item.receivingQuality || 0);
                            if (!isNaN(item.deductSlag)) deduct1 += parseFloat(item.deductSlag || 0);
                            if (!isNaN(item.deductWater)) deduct2 += parseFloat(item.deductWater || 0);
                            if (!isNaN(item.accountQuantity)) settleNum += parseFloat(item.accountQuantity || 0);
                            if (!isNaN(item.quantityDifference)) diff += parseFloat(item.quantityDifference || 0);
                            if (index == data[key].productAccounts.length - 1) {
                              return (
                                <div className={styles.totle} key={index}>
                                  <span>合计</span>
                                  <span>{(shipNum).toFixed(3)}</span>
                                  <span>{(receiptNum).toFixed(3)}</span>
                                  <span>{(deduct1).toFixed(3)}</span>
                                  <span>{(deduct2).toFixed(3)}</span>
                                  <span></span>
                                  <span>{(settleNum).toFixed(3)}</span>
                                  <span>{(diff).toFixed(3)}</span>
                                  <span></span>
                                </div>
                              )
                            }
                          })
                        }
                      </div>
                    </div>

                    <div className={styles.itemBox}>
                      <span className={styles.header}>质检要求</span>
                      <div className={styles.table}>
                        <div className={styles.row}>
                          <span>质检项目</span>
                          <span>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '合同标准' : '质检标准'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '质检标准' : '合同标准'
                              )
                          }</span>
                          <span>发货品质</span>
                          <span>检验品质</span>
                          <span>实际结算品质</span>
                          <span>品质误差</span>
                          <span>是否符合合同要求</span>
                          <span>具体说明</span>
                          <span>备注</span>
                        </div>
                        {
                          data[key].qualityRequirements.map((item, index) =>
                            <div className={styles.row} key={index}>
                              <span>{item.qualityTestProject}</span>
                              <span>{item.qualityTestStandard}</span>
                              <span>{item.deliveryQuality}</span>
                              <span>{item.checkoutQuality}</span>
                              <span>{item.actualAccountQuality}</span>
                              <span>{item.qualityError}</span>
                              <span>{item.isconform}</span>
                              <span>{item.specificExplain}</span>
                              <span>{item.remark}</span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )
            } else {
              if (sessionStorage.businessMode === '1') {
                if ((orderChildInfo.orderStatus === 6 && (role.roleId === 2 || role.roleId === 10)) || (orderChildInfo.orderStatus === 8 && (role.roleId === 1 || role.roleId === 10))) {
                  return (
                    <div className={styles.cardBox} key={key}>
                      <span className={styles.title}>{
                        key === 'sale' ? (
                          role.roleId === 1 || role.roleId === 2 ? '采购结算' : '销售结算'
                        ) : (
                            role.roleId === 1 || role.roleId === 2 ? '销售结算' : '采购结算'
                          )
                      }</span>
                      <div className={styles.content}>
                        {
                          orderChildInfo.frozenStatus !== 0 ? (
                            key === 'sale' ?
                              (
                                role.roleId === 2 ?
                                  <div className={styles.btnBox}>
                                    <Button onClick={this.handleJump.bind(this, 0, null)}>进入编辑</Button>
                                    <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>未确认结算</Button>
                                  </div>
                                  :
                                  role.roleId === 10 ?
                                    <div className={styles.btnBox}>
                                      <Button onClick={this.handleJump.bind(this, 0, null)}>进入编辑</Button>
                                      <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>确认结算</Button>
                                    </div>
                                    :
                                    null
                              )
                              :
                              (
                                role.roleId === 1 || role.roleId === 10 ?
                                  <div className={styles.btnBox}>
                                    <Button onClick={this.handleJump.bind(this, 1, null)}>进入编辑</Button>
                                    <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>确认结算</Button>
                                  </div>
                                  :
                                  null
                              )
                          ) : null
                        }
                        <div className={styles.itemBox}>
                          <span className={styles.header}>{
                            key === 'sale' ? (
                              role.roleId === 1 || role.roleId === 2 ? '付款时间及发票收取情况' : '收款时间及发票开具情况'
                            ) : (
                                role.roleId === 1 || role.roleId === 2 ? '收款时间及发票开具情况' : '付款时间及发票收取情况'
                              )
                          }</span>
                          <div className={styles.table}>
                            <div className={styles.row}>
                              <span>日期</span>
                              <span>说明</span>
                              <span>{
                                key === 'sale' ? (
                                  role.roleId === 1 || role.roleId === 2 ? '已付款' : '已收款'
                                ) : (
                                    role.roleId === 1 || role.roleId === 2 ? '已收款' : '已付款'
                                  )
                              }</span>
                              <span>开票日期</span>
                              <span>开票数量</span>
                              <span>结算单价</span>
                              <span>{
                                key === 'sale' ? (
                                  role.roleId === 1 || role.roleId === 2 ? '已收取进项发票' : '已开具发票金额'
                                ) : (
                                    role.roleId === 1 || role.roleId === 2 ? '已开具发票金额' : '已收取进项发票'
                                  )
                              }</span>
                              <span>不含税金额</span>
                              <span>{
                                key === 'sale' ? (
                                  role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
                                ) : (
                                    role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
                                  )
                              }</span>
                            </div>

                            <div className={styles.row} style={{ marginTop: 10 }}>
                              <span></span>
                              <span>说明</span>
                              <span>{
                                key === 'sale' ? (
                                  role.roleId === 1 || role.roleId === 2 ? '应付款' : '应收款'
                                ) : (
                                    role.roleId === 1 || role.roleId === 2 ? '应收款' : '应付款'
                                  )
                              }</span>
                              <span></span>
                              <span>开票数量</span>
                              <span>结算单价</span>
                              <span>{
                                key === 'sale' ? (
                                  role.roleId === 1 || role.roleId === 2 ? '应收取进项发票' : '应开具发票金额'
                                ) : (
                                    role.roleId === 1 || role.roleId === 2 ? '应开具发票金额' : '应收取进项发票'
                                  )
                              }</span>
                              <span>不含税金额</span>
                              <span>{
                                key === 'sale' ? (
                                  role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
                                ) : (
                                    role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
                                  )
                              }</span>
                            </div>
                            <div className={styles.totle}>
                              <span>合计</span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.itemBox}>
                          <span className={styles.header}>产品结算情况</span>
                          <div className={styles.table}>
                            <div className={styles.row}>
                              <span>{
                                key === 'sale' ? (
                                  role.roleId === 1 || role.roleId === 2 ? '收货时间' : '发货时间'
                                ) : (
                                    role.roleId === 1 || role.roleId === 2 ? '发货时间' : '收货时间'
                                  )
                              }</span>
                              <span>发货数量</span>
                              <span>收货数量</span>
                              <span>扣渣</span>
                              <span>扣水</span>
                              <span>其他</span>
                              <span>结算数量</span>
                              <span>数量差异</span>
                              <span>运输方式</span>
                            </div>
                            <div className={styles.totle}>
                              <span>合计</span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.itemBox}>
                          <span className={styles.header}>质检要求</span>
                          <div className={styles.table}>
                            <div className={styles.row}>
                              <span>质检项目</span>
                              <span>{
                                key === 'sale' ? (
                                  role.roleId === 1 || role.roleId === 2 ? '合同标准' : '质检标准'
                                ) : (
                                    role.roleId === 1 || role.roleId === 2 ? '质检标准' : '合同标准'
                                  )
                              }</span>
                              <span>发货品质</span>
                              <span>检验品质</span>
                              <span>实际结算品质</span>
                              <span>品质误差</span>
                              <span>是否符合合同要求</span>
                              <span>具体说明</span>
                              <span>备注</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <p className={styles.noAny}>暂无数据</p>
                  )
                }
              } else {
                return (
                  <div className={styles.cardBox} key={key}>
                    <span className={styles.title}>{
                      key === 'sale' ? (
                        role.roleId === 1 || role.roleId === 2 ? '采购结算' : '销售结算'
                      ) : (
                          role.roleId === 1 || role.roleId === 2 ? '销售结算' : '采购结算'
                        )
                    }</span>
                    <div className={styles.content}>
                      {
                        orderChildInfo.frozenStatus !== 0 ? (
                          key === 'sale' ?
                            (
                              role.roleId === 1 || role.roleId === 10 ?
                                <div className={styles.btnBox}>
                                  <Button onClick={this.handleJump.bind(this, 0, null)}>进入编辑</Button>
                                  <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>确认结算</Button>
                                </div>
                                :
                                null
                            )
                            :
                            (
                              role.roleId === 2 ?
                                <div className={styles.btnBox}>
                                  <Button onClick={this.handleJump.bind(this, 1, null)}>进入编辑</Button>
                                  <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>未确认结算</Button>
                                </div>
                                :
                                role.roleId === 10 ?
                                  <div className={styles.btnBox}>
                                    <Button onClick={this.handleJump.bind(this, 1, null)}>进入编辑</Button>
                                    <Button style={{ marginLeft: 10 }} type="primary" disabled={true}>确认结算</Button>
                                  </div>
                                  :
                                  null
                            )
                        ) : null
                      }
                      <div className={styles.itemBox}>
                        <span className={styles.header}>{
                          key === 'sale' ? (
                            role.roleId === 1 || role.roleId === 2 ? '付款时间及发票收取情况' : '收款时间及发票开具情况'
                          ) : (
                              role.roleId === 1 || role.roleId === 2 ? '收款时间及发票开具情况' : '付款时间及发票收取情况'
                            )
                        }</span>
                        <div className={styles.table}>
                          <div className={styles.row}>
                            <span>日期</span>
                            <span>说明</span>
                            <span>{
                              key === 'sale' ? (
                                role.roleId === 1 || role.roleId === 2 ? '已付款' : '已收款'
                              ) : (
                                  role.roleId === 1 || role.roleId === 2 ? '已收款' : '已付款'
                                )
                            }</span>
                            <span>开票日期</span>
                            <span>开票数量</span>
                            <span>结算单价</span>
                            <span>{
                              key === 'sale' ? (
                                role.roleId === 1 || role.roleId === 2 ? '已收取进项发票' : '已开具发票金额'
                              ) : (
                                  role.roleId === 1 || role.roleId === 2 ? '已开具发票金额' : '已收取进项发票'
                                )
                            }</span>
                            <span>不含税金额</span>
                            <span>{
                              key === 'sale' ? (
                                role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
                              ) : (
                                  role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
                                )
                            }</span>
                          </div>

                          <div className={styles.row} style={{ marginTop: 10 }}>
                            <span>日期</span>
                            <span>说明</span>
                            <span>{
                              key === 'sale' ? (
                                role.roleId === 1 || role.roleId === 2 ? '应付款' : '应收款'
                              ) : (
                                  role.roleId === 1 || role.roleId === 2 ? '应收款' : '应付款'
                                )
                            }</span>
                            <span>开票日期</span>
                            <span>开票数量</span>
                            <span>结算单价</span>
                            <span>{
                              key === 'sale' ? (
                                role.roleId === 1 || role.roleId === 2 ? '应收取进项发票' : '应开具发票金额'
                              ) : (
                                  role.roleId === 1 || role.roleId === 2 ? '应开具发票金额' : '应收取进项发票'
                                )
                            }</span>
                            <span>不含税金额</span>
                            <span>{
                              key === 'sale' ? (
                                role.roleId === 1 || role.roleId === 2 ? '付款方式' : '收款方式'
                              ) : (
                                  role.roleId === 1 || role.roleId === 2 ? '收款方式' : '付款方式'
                                )
                            }</span>
                          </div>
                          <div className={styles.totle}>
                            <span>合计</span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.itemBox}>
                        <span className={styles.header}>产品结算情况</span>
                        <div className={styles.table}>
                          <div className={styles.row}>
                            <span>{
                              key === 'sale' ? (
                                role.roleId === 1 || role.roleId === 2 ? '收货时间' : '发货时间'
                              ) : (
                                  role.roleId === 1 || role.roleId === 2 ? '发货时间' : '收货时间'
                                )
                            }</span>
                            <span>发货数量</span>
                            <span>收货数量</span>
                            <span>扣渣</span>
                            <span>扣水</span>
                            <span>其他</span>
                            <span>结算数量</span>
                            <span>数量差异</span>
                            <span>运输方式</span>
                          </div>
                          <div className={styles.totle}>
                            <span>合计</span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.itemBox}>
                        <span className={styles.header}>质检要求</span>
                        <div className={styles.table}>
                          <div className={styles.row}>
                            <span>质检项目</span>
                            <span>{
                              key === 'sale' ? (
                                role.roleId === 1 || role.roleId === 2 ? '合同标准' : '质检标准'
                              ) : (
                                  role.roleId === 1 || role.roleId === 2 ? '质检标准' : '合同标准'
                                )
                            }</span>
                            <span>发货品质</span>
                            <span>检验品质</span>
                            <span>实际结算品质</span>
                            <span>品质误差</span>
                            <span>是否符合合同要求</span>
                            <span>具体说明</span>
                            <span>备注</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            }
          })
            : <p className={styles.noAny}>暂无数据</p>
        }
      </div>
    )
  }
}
