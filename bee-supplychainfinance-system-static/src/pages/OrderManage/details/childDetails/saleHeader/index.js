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
@connect(({ global, detail, loading }) => ({
  global,
  detail,
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
      payload: id
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
    let id = orderChildInfo.subSaleOrdersId;

    if (type === 3) { //付款证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visiblePayment');
    } else if (type === 5 || type === 6) { //切换到票据
      onChangeTab && onChangeTab('bill');
    } else if (type === 9 || type === 13) { //开票证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleInvoice', invoiceType);
    } else if (type === 11) { //切换到结算单
      onChangeTab && onChangeTab('settlement');
    } else if (type === 14) { //跳转到结算审批详情页
      router.push(`/approval/settlement/details/childDetails?enterType=0&num=${num}&key=settlement&id=${id}&orderId=${orderId}`);
    }
  }

  setButton = () => {
    const { role } = this.props.global;
    const { orderChildInfo } = this.props.detail;
    const { enterType } = this.props.location.query;
    if (enterType === "1") {
      if (orderChildInfo.orderStatus === 4) {
        if (role.roleId === 1) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 9, 0)}>提交开票证明</Button>
          </div>
        } else if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 5)}>确认发票</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 5) {
        if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 3)}>提交付款证明</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 6) {
        if (role.roleId === 2) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 11)}>编辑结算单</Button>
          </div>
        } else if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 11)}>编辑结算单</Button>
            <Button type="primary" disabled={orderChildInfo.auditStatus ? true : false} onClick={this.handle.bind(this, 14)}>审核结算单</Button>
          </div>
        } else if (role.roleId === 11 || role.roleId === 12) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.auditStatus ? true : false} onClick={this.handle.bind(this, 14)}>审核结算单</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 7) {
        if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 0 || orderChildInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 5)}>确认收款</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 1 || orderChildInfo.submitStatus === 2 ? true : false} onClick={this.handle.bind(this, 9, 1)}>提交开票证明</Button>
          </div>
        } else if (role.roleId === 2) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 2 || orderChildInfo.submitStatus === 3 ? true : false} onClick={this.handle.bind(this, 3)}>提交付款证明</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 8) {
        if (role.roleId === 1) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 11)}>编辑结算单</Button>
          </div>
        } else if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 11)}>编辑结算单</Button>
            <Button type="primary" disabled={orderChildInfo.auditStatus ? true : false} onClick={this.handle.bind(this, 14)}>审核结算单</Button>
          </div>
        } else if (role.roleId === 11 || role.roleId === 12) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.auditStatus ? true : false} onClick={this.handle.bind(this, 14)}>审核结算单</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 9) {
        if (role.roleId === 1) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 9, 0)}>提交开票证明</Button>
          </div>
        } else if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 5)}>确认发票</Button>
          </div>
        } else {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
          </div>
        }
      } else if (orderChildInfo.orderStatus === 10) {
        if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderChildInfo.submitStatus === 1 ? true : false} onClick={() => {
              Modal.confirm({
                title: '请确认四川金密是否收到服务费？',
                content: '若没有收到服务费请取消操作',
                okText: '继续',
                cancelText: '取消',
                onOk: () => this.handle(3)
              });
            }}>提交付款证明</Button>
          </div>
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
      orderId: orderChildInfo.subSaleOrdersId
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
          orderId: orderChildInfo.subSaleOrdersId
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
              <span>{orderChildInfo.subSaleOrdersName ? orderChildInfo.subSaleOrdersName : '未知'} {orderChildInfo.createTime ? orderChildInfo.createTime : '无'}</span>
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
                  <span>委托企业发货数：</span>
                  <span>{orderChildInfo.entrustDeliveryNumber !== undefined && orderChildInfo.entrustDeliveryNumber !== null ? orderChildInfo.entrustDeliveryNumber + ' 吨' : '无'}</span>
                </div>
                <div>
                  <span>购货商回款金额：</span>
                  <span>{orderChildInfo.purchasePayAmount !== undefined && orderChildInfo.purchasePayAmount !== null ? orderChildInfo.purchasePayAmount + ' 元' : '无'}</span>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <span>付款时间：</span>
                  <span>{orderChildInfo.paymentDate ? orderChildInfo.paymentDate : '未知'}</span>
                </div>
                <div>
                  <span>委托企业开票金额：</span>
                  <span>{orderChildInfo.entrustInvoiceAmount !== undefined && orderChildInfo.entrustInvoiceAmount !== null ? orderChildInfo.entrustInvoiceAmount + ' 元' : '未知'}</span>
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
                      orderChildInfo.orderStatus === 4 ? '委托企业开票' :
                        orderChildInfo.orderStatus === 5 ? '支付货款' :
                          orderChildInfo.orderStatus === 6 ? '采购商结算' :
                            orderChildInfo.orderStatus === 7 ? '采购商回款' :
                              orderChildInfo.orderStatus === 8 ? '委托方结算' :
                                orderChildInfo.orderStatus === 9 ? '委托企业开尾票' :
                                  orderChildInfo.orderStatus === 10 ? '支付尾款' :
                                    orderChildInfo.orderStatus === 11 ? '冻结中' :
                                      orderChildInfo.orderStatus === 12 ? '已完成' : '无'
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
                orderChildInfo.orderStatus === 6 ?
                  <Select style={{ width: 240 }}>
                    <Option value="0">销售结算单</Option>
                  </Select> :
                  <Select style={{ width: 240 }}>
                    <Option value="1">采购结算单</Option>
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