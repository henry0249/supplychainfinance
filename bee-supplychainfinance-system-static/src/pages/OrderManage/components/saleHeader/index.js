import React, { Component } from 'react';
import styles from './index.less';
import { Breadcrumb, Icon, Button, Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from "umi/withRouter";

const FormItem = Form.Item;

@withRouter
@Form.create()
@connect(({ global, detail, bill, loading }) => ({
  global,
  detail,
  bill,
  loading: loading.effects
}))
export default class Index extends Component {
  state = {
    edit: false
  }

  getData = () => {
    const { dispatch } = this.props;
    const { enterType, id } = this.props.location.query;
    // 获取订单详情
    dispatch({
      type: 'detail/getOrderInfo',
      payload: id
    })
    // 获取所有类型票据
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
        type: 'bill/getLogs',
        payload: `${id}&searchCount=false`,
        error: (msg) => {
          message.error('获取票据操作日志失败：' + msg);
        }
      })
    }
  }

  // 触发方法
  handle = (type, letterType) => {
    const { onShowModal, onChangeTab, dispatch } = this.props;
    const { orderInfo } = this.props.detail;
    const { id } = this.props.location.query;
    let self = this;
    let orderId = orderInfo.saleOrdersId;

    if (type === 1) { //跳转到合同审批的详情页
      router.push(`/approval/contract/details?enterType=0&key=contract&id=${orderId}`);
    } else if (type === 2) { //跳转到保证金审批的详情页
      router.push(`/approval/bail/details?enterType=0&type=bail&key=bill&id=${orderId}`);
    } else if (type === 3) { //切换到票据
      onChangeTab && onChangeTab('bill');
    } else if (type === 4) { //切换到合同
      onChangeTab && onChangeTab('contract');
    } else if (type === 5) { //货权转移证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleTransfer');
    } else if (type === 6) { //保证金证明
      onChangeTab && onChangeTab('bill')
      onShowModal && onShowModal('visibleBail');
    } else if (type === 7) { //终止发货
      Modal.confirm({
        title: '确定终止发货',
        content: '终止发货后无法撤回，是否要继续？',
        onOk() {
          dispatch({
            type: 'bill/stopShip',
            payload: id,
            success: () => {
              message.success("终止发货成功");
              self.getData();
            },
            error: (msg) => {
              message.error("终止发货失败：" + msg);
            }
          })
        },
        onCancel() {
          console.log('取消终止发货');
        },
      });
    } else if (type === 8) { // 提交函证明
      onChangeTab && onChangeTab('bill')
      onShowModal && onShowModal('visibleLetter', null, letterType);
    }
  }

  setSaleButton = () => {
    const { role } = this.props.global;
    const { orderInfo } = this.props.detail;
    const { enterType } = this.props.location.query;

    if (enterType === "1") {
      if (orderInfo.orderStatus === 0) {
        if (role.roleId === 4) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 4)}>编辑合同</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 8, 1)}>提交委托销售函</Button>
          </div>
        } else if (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 1)}>审核合同</Button>
          </div>
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 1) {
        if (role.roleId === 1) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 6)}>提交保证金证明</Button>
          </div>
        } else if (role.roleId === 10 || role.roleId === 11 || role.roleId === 12) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 2)}>审核保证金</Button>
          </div>
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 2) {
        if (role.roleId === 4) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 4)}>编辑合同</Button>
          </div>
        } else if (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 1)}>审核合同</Button>
          </div>
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 3) {
        //1,"装车后付款"  2,"货到后付款"
        if (orderInfo.paymentProvision === 1) {
          if (role.roleId === 1) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 5)}>{orderInfo.submitStatus === 1 ? '您有货权转移证明未被确认' : '提交货权转移证明'}</Button>
            </div>
          } else if (role.roleId === 7) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 3)}>确认货权转移</Button>
            </div>
          } else if (role.roleId === 10) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" onClick={this.handle.bind(this, 7)}>终止发货</Button>
            </div>
          } else {
            return <div className={styles.btnBox}></div>
          }
        } else if (orderInfo.paymentProvision === 2) {
          if (role.roleId === 2) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 5)}>{orderInfo.submitStatus === 1 ? '您有货权转移证明未被确认' : '提交货权转移证明'}</Button>
            </div>
          } else if (role.roleId === 7) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 3)}>确认货权转移</Button>
            </div>
          } else if (role.roleId === 10) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" onClick={this.handle.bind(this, 5)}>帮购货商提交货权转移证明</Button>
              <Button type="primary" onClick={this.handle.bind(this, 7)}>终止发货</Button>
            </div>
          } else {
            return <div className={styles.btnBox}></div>
          }
        }
      } else {
        return <div className={styles.btnBox}></div>
      }
    } else {
      return <div className={styles.btnBox}></div>
    }
  }

  saveModeName = () => {
    const { dispatch } = this.props;
    const { validateFields } = this.props.form;
    const { id } = this.props.location.query;
    validateFields(['modeName'], (err, values) => {
      if (!err) {
        if (!values.modeName) {
          return message.error("请输入业务名称");
        }

        if (String(values.modeName).length > 20) {
          return message.error("业务名称最大长度不超过20");
        }

        let params = {
          modeName: values.modeName,
          orderBusinessId: id
        }

        dispatch({
          type: 'detail/saveModeName',
          payload: params,
          success: () => {
            // 获取订单详情
            dispatch({
              type: 'detail/getOrderInfo',
              payload: id,
              success: (res) => {
                this.setState({
                  edit: false
                }, () => message.success('业务名称保存成功'))
              },
            })
          },
          error: (msg) => {
            message.error('业务名称保存失败:' + msg);
          }
        })
      }
    })
  }

  render() {
    const { enterType, type, key } = this.props.location.query;
    const { role } = this.props.global;
    const { orderInfo } = this.props.detail;
    const { getFieldDecorator } = this.props.form;
    const { edit } = this.state;
    return (
      <div className={styles.header}>
        <Breadcrumb>
          <Breadcrumb.Item>{parseInt(enterType) === 0 ? <Link to={`/approval/${type || 'projectapproval'}/index`}>审批管理</Link> : <Link to="/orderManage/index">订单管理</Link>}</Breadcrumb.Item>
          <Breadcrumb.Item>{parseInt(enterType) === 0 ? '审批详情' : '订单详情'}</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.info}>
          <div className={styles.left}>
            {
              edit ?
                <div className={styles.name}>
                  <Icon style={{ fontSize: 28 }} type="home" theme="twoTone" />
                  <Form layout='inline' style={{ marginLeft: 16 }}>
                    <FormItem>
                      {getFieldDecorator('modeName')(
                        <Input placeholder="业务名称" />
                      )}
                    </FormItem>
                  </Form>
                  <Button onClick={this.saveModeName} type="primary">保存</Button>
                </div>
                :
                <div className={styles.name}>
                  <Icon style={{ fontSize: 28 }} type="home" theme="twoTone" />
                  <span className={styles.company}>{orderInfo.modeName !== undefined ? orderInfo.modeName : '无'} {
                    type ? (
                      type === 'contract' ? '合同审核' :
                        type === 'settlement' ? '结算审核' :
                          type === 'bail' ? '保证金审核' : ''
                    ) : ''
                  }</span>
                  {
                    enterType === '1' && (role.roleId === 6 || role.roleId === 7 || role.roleId === 8) && <Icon onClick={() => this.setState({ edit: true })} style={{ fontSize: 17, marginLeft: 5, cursor: 'pointer' }} type="edit" />
                  }
                </div>
            }
            <div className={styles.information}>
              <div className={styles.row}>
                <div>
                  <span>业务类型：</span>
                  <span>委托销售</span>
                </div>
                <div>
                  <span>货品：</span>
                  <span style={{ color: "#1890ff" }}>{orderInfo.goodsName !== undefined && orderInfo.goodsName !== null ? orderInfo.goodsName : '无'}</span>
                </div>
                <div>
                  <span>占用资金：</span>
                  <span>{orderInfo.occupyAmount !== undefined && orderInfo.occupyAmount !== null ? orderInfo.occupyAmount + '元' : '无'}</span>
                </div>
                {
                  // 委托销售，且角色为委托企业时，隐藏剩余金额
                  role.roleId === 1 ?
                    null :
                    <div>
                      <span>未回货款：</span>
                      <span>{orderInfo.payRemain !== undefined && orderInfo.payRemain !== null ? orderInfo.payRemain + '元' : '无'}</span>
                    </div>
                }
              </div>
              <div className={styles.row}>
                <div>
                  <span>委托企业：</span>
                  <span>{orderInfo.entrustCompanyName !== undefined && orderInfo.entrustCompanyName !== null ? orderInfo.entrustCompanyName : '无'}</span>
                </div>
                {
                  // 委托销售，委托企业隐藏
                  role.roleId === 1 ?
                    null :
                    <div>
                      <span>{role.roleId === 2 ? '已付款金额' : '已回款金额'}：</span>
                      <span>{orderInfo.payAlready !== undefined && orderInfo.payAlready !== null ? orderInfo.payAlready + '元' : '无'}</span>
                    </div>
                }
                {
                  role.roleId === 1 ?
                    null :
                    <div>
                      <span>{role.roleId === 2 ? '已收票金额' : '已开票金额'}：</span>
                      <span>{orderInfo.invoiceAlready !== undefined && orderInfo.invoiceAlready !== null ? orderInfo.invoiceAlready + '元' : '无'}</span>
                    </div>
                }
              </div>
              <div className={styles.row}>
                <div>
                  <span>购货方：</span>
                  <span>{orderInfo.purchaseCompanyName ? orderInfo.purchaseCompanyName : '无'}</span>
                </div>
                {
                  role.roleId === 1 || role.roleId === 2 || role.roleId === 3 ?
                    null :
                    <div>
                      <span>已付款金额：</span>
                      <span>{orderInfo.payment !== undefined && orderInfo.payment !== null ? orderInfo.payment + '元' : '无'}</span>
                    </div>
                }
                {
                  // 委托销售，核心企业隐藏
                  role.roleId === 2 ?
                    null :
                    <div>
                      <span>{role.roleId === 1 ? '已开票金额' : '已收票金额'}：</span>
                      <span>{orderInfo.invoiceNot !== undefined && orderInfo.invoiceNot !== null ? orderInfo.invoiceNot + '元' : '无'}</span>
                    </div>
                }
                <div>
                  <span>发货单数量：</span>
                  <span>{orderInfo.deliveryBillNumber !== undefined && orderInfo.deliveryBillNumber !== null ? orderInfo.deliveryBillNumber + ' 吨' : '无'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {
              orderInfo.frozenStatus !== 0 ? this.setSaleButton() : <div className={styles.btnBox}></div>
            }
            <div className={styles.stateBox} style={{ flex: 1 }}>
              <div className={styles.item}>
                <span>状态</span>
                <span>{
                  orderInfo.frozenStatus !== 0 ? (
                    orderInfo.orderStatus !== undefined && orderInfo.orderStatus !== null ? (
                      orderInfo.orderStatus === 0 ? '签订委托合同' :
                        orderInfo.orderStatus === 1 ? '提交保证金' :
                          orderInfo.orderStatus === 2 ? '签订销售合同' :
                            orderInfo.orderStatus === 3 ? '转移货权' :
                              orderInfo.orderStatus === 11 ? '冻结中' :
                                orderInfo.orderStatus === 12 ? '已完成' :
                                  orderInfo.orderStatus === 13 ? '终止发货' : '无'
                    ) : '未知订单状态'
                  ) : '冻结中'
                }</span>
              </div>
              <div className={styles.item} style={{ width: 140 }}>
                <span>剩余额度</span>
                <span style={{ color: '#1890ff' }}>{orderInfo.quotaRemain !== undefined && orderInfo.quotaRemain !== null ? orderInfo.quotaRemain + '元' : '无'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}