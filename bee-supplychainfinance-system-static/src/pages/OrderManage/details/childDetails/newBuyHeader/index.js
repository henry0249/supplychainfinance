import React, { Component } from 'react';
import styles from './index.less';
import { Icon, Button, Modal, Form, Input, message, Select } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import withRouter from "umi/withRouter";

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@withRouter
@Form.create()
@connect(({ global, detail, check, loading }) => ({
  global,
  detail,
  check,
  loading: loading.effects
}))
export default class Index extends Component {
  state = {
    visible: false
  }

  getData = () => {
    const { dispatch } = this.props;
    const { enterType, id } = this.props.location.query;
    // 获取子订单详情
    dispatch({
      type: 'detail/getorderChildInfo',
      payload: id,
      success: (res) => {
        if (res.data.type === 4 && res.data.orderStatus === 0) {
          dispatch({
            type: 'check/queryPay',
            payload: id,
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
    // 获取子订单所有类型票据
    dispatch({
      type: 'bill/getInfo',
      payload: id,
      error: (msg) => {
        message.error('获取所有票据失败：' + msg);
      }
    })
    // 获取票据的退回信息
    dispatch({
      type: 'bill/getRefused',
      payload: id,
      error: (msg) => {
        message.error('获取票据退回信息失败：' + msg);
      }
    })
    // 获取票据操作日志
    if (enterType && enterType === '1') {
      dispatch({
        type: 'bill/getChildLogs',
        payload: id,
        error: (msg) => {
          message.error('获取票据操作日志失败：' + msg);
        }
      })
    }
  }

  // 触发方法
  handle = (type, invoiceType) => {
    const { onShowModal, onChangeTab } = this.props;
    const { orderChildInfo } = this.props.detail;
    const { num, orderId } = this.props.location.query;
    let id = orderChildInfo.largeBuySubOrdersId;

    if (type === 0) { //提交委托付款函证明
      onChangeTab && onChangeTab('bill')
      onShowModal && onShowModal('visibleLetter');
    } else if (type === 1) { //提交付款证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visiblePayment', invoiceType);
    } else if (type === 2) { //切换到结算单
      onChangeTab && onChangeTab('settlement');
    } else if (type === 3) { //跳转到结算审批详情页
      router.push(`/approval/settlement/details/childDetails?enterType=0&num=${num}&key=settlement&id=${id}&orderId=${orderId}`);
    } else if (type === 4) {
      onChangeTab && onChangeTab('bill');
    } else if (type === 5) { //开票证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleInvoice', invoiceType);
    }
  }

  setButton = () => {
    const { role } = this.props.global;
    const { orderChildInfo } = this.props.detail;
    const { payStatus } = this.props.check;
    const { enterType } = this.props.location.query;

    if (enterType === "1") {
      if (orderChildInfo.orderStatus === 0) {
        if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={payStatus === 0 ? false : true} onClick={this.handle.bind(this, 0)}>提交委托付款函</Button>
            <Button type="primary" disabled={payStatus === 0 ? true : false} onClick={this.handle.bind(this, 1, null)}>提交付款证明</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 1) {
        if (role.roleId === 1 || role.roleId === 2) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 2)}>编辑结算单</Button>
          </div>
        } else if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 2)}>编辑结算单</Button>
            <Button type="primary" disabled={orderChildInfo.auditStatus ? true : false} onClick={this.handle.bind(this, 3)}>审核结算单</Button>
          </div>
        } else if (role.roleId === 11 || role.roleId === 12) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.auditStatus ? true : false} onClick={this.handle.bind(this, 3)}>审核结算单</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 2) {
        if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 4)}>确认收款</Button>
          </div>
        } else if (role.roleId === 1) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 1, null)}>提交付款证明</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 3) {
        if (role.roleId === 2) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 5, 0)}>提交开票证明</Button>
          </div>
        } else if (role.roleId === 10) {
          if (orderChildInfo.submitStatus) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderChildInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 4)}>确认发票</Button>
              <Button type="primary" onClick={() => {
                Modal.confirm({
                  title: '请确认四川金密是否收到服务费？',
                  content: '若没有收到服务费请取消操作',
                  okText: '继续',
                  cancelText: '取消',
                  onOk: () => this.handle(5, 1)
                });
              }}>提交开票证明</Button>
            </div>
          } else {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderChildInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 5, 0)}>帮供应商提交开票证明</Button>
              <Button type="primary" onClick={() => {
                Modal.confirm({
                  title: '请确认四川金密是否收到服务费？',
                  content: '若没有收到服务费请取消操作',
                  okText: '继续',
                  cancelText: '取消',
                  onOk: () => this.handle(5, 1)
                });
              }}>提交开票证明</Button>
            </div>
          }
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 6 && role.roleId === 10) {
        if (orderChildInfo.retreatFillType) {
          if (orderChildInfo.retreatFillType.indexOf(',') > -1) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              {
                orderChildInfo.retreatFillType.split(',').map(key =>
                  <Button type="primary" onClick={this.handle.bind(this, 1, key)} key={key}>{
                    key === '3' ? '供应商收款' : '供应商付款'
                  }</Button>
                )
              }
            </div>
          } else {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" onClick={this.handle.bind(this, 1, orderChildInfo.retreatFillType)}>{
                orderChildInfo.retreatFillType === '3' ? '供应商收款' : '供应商付款'
              }</Button>
            </div>
          }
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else {
        return <div className={styles.btnBox}>
          <Button onClick={() => router.goBack()}>返 回</Button>
        </div>
      }
    } else {
      if (role.roleId === 10 || role.roleId === 11 || role.roleId === 12) {
        if (orderChildInfo.auditStatus) {
          return <div className={styles.btnBox}>
            <Button type="primary" disabled={true}>无法审核</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => this.setState({ visible: true })}>拒绝</Button>
            <Button type="primary" onClick={this.showConfirm.bind(this)}>通过</Button>
          </div>
        }
      } else {
        return <div className={styles.btnBox}>
          <Button onClick={() => router.goBack()}>返 回</Button>
        </div>
      }
    }
  }

  showConfirm = () => {
    Modal.confirm({
      title: '请确认所有审核意见',
      content: '提交后将无法修改任何信息',
      okText: '继续',
      cancelText: '取消',
      onOk: this.passOk.bind(this)
    })
  }

  passOk = () => {
    const { dispatch } = this.props;
    const { orderChildInfo } = this.props.detail;

    let params = {
      isPass: 1, // 是否通过，0否，1是
      orderId: orderChildInfo.largeBuySubOrdersId
    }

    dispatch({
      type: 'check/checkSettlement',
      payload: params,
      success: () => {
        router.push(`/result?type=settlement&id=${params.orderId}&status=0&isManage=1`)
      },
      error: (msg) => {
        message.error("审批结算单失败：" + msg);
      }
    })
  }

  returnOk = () => {
    const { dispatch } = this.props;
    const { orderChildInfo } = this.props.detail;
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          isPass: 0, // 是否通过，0否，1是
          refusedType: values.refusedType, // 拒绝的结算单类型，0销售结算单，1采购结算单，2全部
          recentlyReason: values.recentlyReason, // 驳回原因
          orderId: orderChildInfo.largeBuySubOrdersId
        }

        dispatch({
          type: 'check/checkSettlement',
          payload: params,
          success: () => {
            router.push(`/result?type=settlement&id=${params.orderId}&status=1&isManage=1`)
          },
          error: (msg) => {
            this.setState({
              visible: false
            }, () => message.error("审批结算单失败：" + msg))
          }
        })
      }
    })
  }

  render() {
    const { orderChildInfo } = this.props.detail;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    return (
      <div className={styles.header}>
        <div className={styles.info}>
          <div className={styles.left}>
            <div className={styles.name}>
              <Icon style={{ fontSize: 28 }} type="home" theme="twoTone" />
              <span>{orderChildInfo.largeBuySubOrdersName ? orderChildInfo.largeBuySubOrdersName : '未知'} {orderChildInfo.createTime ? orderChildInfo.createTime : '无'}</span>
            </div>
            <div className={styles.information}>
              <div className={styles.row}>
                <div>
                  <span>货品：</span>
                  <span style={{ color: "#1890ff" }}>{orderChildInfo.goodsName ? orderChildInfo.goodsName : ' 无'}</span>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <span>支付货款：</span>
                  <span>{orderChildInfo.paymentForGoods !== undefined && orderChildInfo.paymentForGoods !== null ? orderChildInfo.paymentForGoods + ' 元' : '无'}</span>
                </div>
                <div>
                  <span>供应商发货数：</span>
                  <span>{orderChildInfo.supplyDeliveryNumber !== undefined && orderChildInfo.supplyDeliveryNumber !== null ? orderChildInfo.supplyDeliveryNumber + ' 吨' : '无'}</span>
                </div>
                <div>
                  <span>委托企业回款金额：</span>
                  <span>{orderChildInfo.entrustPayAmount !== undefined && orderChildInfo.entrustPayAmount !== null ? orderChildInfo.entrustPayAmount + ' 元' : '无'}</span>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <span>付款时间：</span>
                  <span>{orderChildInfo.paymentDate ? orderChildInfo.paymentDate : '未知'}</span>
                </div>
                <div>
                  <span>供应商开票金额：</span>
                  <span>{orderChildInfo.supplyInvoiceAmount !== undefined && orderChildInfo.supplyInvoiceAmount !== null ? orderChildInfo.supplyInvoiceAmount + ' 元' : '未知'}</span>
                </div>
                <div>
                  <span>结算专员开票金额：</span>
                  <span>{orderChildInfo.accountInvoiceAmount !== undefined && orderChildInfo.accountInvoiceAmount !== null ? orderChildInfo.accountInvoiceAmount + ' 元' : '未知'}</span>
                </div>
                <div>
                  <span>未回货款：</span>
                  <span>{orderChildInfo.payRemain !== undefined && orderChildInfo.payRemain !== null ? orderChildInfo.payRemain + ' 元' : '未知'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {
              orderChildInfo.frozenStatus !== 0 ? this.setButton() : <div className={styles.btnBox}></div>
            }
            <div className={styles.stateBox} style={{ flex: 1 }}>
              <div className={styles.item}>
                <span>状态</span>
                <span style={orderChildInfo.orderStatus === 12 ? { color: '#00FF00' } : { color: '#1890ff' }}>{
                  orderChildInfo.frozenStatus !== 0 ? (
                    orderChildInfo.orderStatus !== undefined && orderChildInfo.orderStatus !== null ? (
                      orderChildInfo.orderStatus === 0 ? '支付货款' :
                        orderChildInfo.orderStatus === 1 ? '结算确认' :
                          orderChildInfo.orderStatus === 2 ? '委托企业回款' :
                            orderChildInfo.orderStatus === 3 ? '开票收票' :
                              orderChildInfo.orderStatus === 4 ? '冻结中' :
                                orderChildInfo.orderStatus === 5 ? '已完成' :
                                  orderChildInfo.orderStatus === 6 ? '多退少补' : '无'
                    ) : '未知订单状态'
                  ) : '冻结中'
                }</span>
              </div>
              <div className={styles.item} style={{ width: 106 }}>
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="退回原因"
          visible={visible}
          onOk={this.returnOk}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form layout='inline'>
            <FormItem label='退回结算'>
              {getFieldDecorator('refusedType', {
                rules: [{
                  required: true, message: '请选择',
                }]
              })(
                <Select style={{ width: 240 }}>
                  <Option value="2">全部</Option>
                  <Option value="1">采购结算单</Option>
                  <Option value="0">销售结算单</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label='退回原因' style={{ marginTop: 20 }}>
              {getFieldDecorator('recentlyReason', {
                rules: [{
                  required: true, message: '请输入退回原因',
                }, {
                  max: 255, message: '超出最大长度限制'
                }]
              })(
                <TextArea style={{ width: 350 }} autosize={{ minRows: 5, maxRows: 5 }} placeholder="请输入" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div >
    )
  }
}