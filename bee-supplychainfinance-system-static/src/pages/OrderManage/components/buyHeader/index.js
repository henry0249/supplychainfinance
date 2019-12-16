import React, { Component } from 'react';
import styles from './index.less';
import { Breadcrumb, Icon, Button, Modal, Form, Input, message, Select } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import withRouter from "umi/withRouter";

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@withRouter
@Form.create()
@connect(({ global, detail, bill, check, loading }) => ({
  global,
  detail,
  bill,
  check,
  loading: loading.effects
}))
export default class Index extends Component {
  state = {
    visible: false,
    edit: false
  }

  getData = () => {
    const { dispatch } = this.props;
    const { enterType, id } = this.props.location.query;
    // 获取订单详情
    dispatch({
      type: 'detail/getOrderInfo',
      payload: id,
      success: (res) => {
        if (res.type === 0 && res.orderStatus === 4) {
          dispatch({
            type: 'check/queryPay',
            payload: id,
            success: () => {
            },
            error: (msg) => {
              message.error(`查询委托付款函确认情况失败：` + msg)
            }
          })
        }
      },
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
  handle = (type, invoiceType, letterType) => {
    const { onShowModal, onChangeTab } = this.props;
    const { orderInfo } = this.props.detail;
    let orderId = orderInfo.buyOrdersId;
    if (type === 1) { //跳转到合同审批的详情页
      router.push(`/approval/contract/details?enterType=0&key=contract&id=${orderId}`);
    } else if (type === 2) { //跳转到保证金审批的详情页
      router.push(`/approval/bail/details?enterType=0&type=bail&key=bill&id=${orderId}`);
    } else if (type === 3) { //付款证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visiblePayment', invoiceType);
    } else if (type === 4) { //放货证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleDelivery');
    } else if (type === 5) { //切换到票据
      onChangeTab && onChangeTab('bill');
    } else if (type === 6) { //跳转到提货审批的详情页
      router.push(`/approval/goods/details?enterType=0&type=goods&key=bill&id=${orderId}`);
    } else if (type === 7) { //跳转到延期提货的详情页
      router.push(`/approval/deferred/details?enterType=0&type=deferred&key=bill&id=${orderId}`);
    } else if (type === 8) { //开票证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleInvoice', invoiceType);
    } else if (type === 9) { //切换到合同
      onChangeTab && onChangeTab('contract');
    } else if (type === 10) { //切换到结算单
      onChangeTab && onChangeTab('settlement');
    } else if (type === 11) { //货权转移证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleTransfer');
    } else if (type === 12) { //跳转到结算审批详情页
      router.push(`/approval/settlement/details?enterType=0&type=settlement&key=settlement&id=${orderId}`);
    } else if (type === 13) { //保证金证明
      onChangeTab && onChangeTab('bill')
      onShowModal && onShowModal('visibleBail');
    } else if (type === 14) { //提货申请
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleGoods');
    } else if (type === 15) { //延期提货证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleDelay');
    } else if (type === 16) { //函证明
      onChangeTab && onChangeTab('bill');
      onShowModal && onShowModal('visibleLetter', invoiceType, letterType);
    }
  }

  setBuyButton = () => {
    const { role } = this.props.global;
    const { orderInfo } = this.props.detail;
    const { payStatus } = this.props.check;
    const { enterType, type } = this.props.location.query;

    if (enterType === "1") {
      if (orderInfo.orderStatus === 0) {
        //签订委托合同
        if (role.roleId === 4) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 9)}>编辑合同</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 16, null, 0)}>提交委托采购函</Button>
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
        //提交保证金
        if (role.roleId === 1) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 13)}>提交保证金证明</Button>
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
            <Button type="primary" onClick={this.handle.bind(this, 9)}>编辑合同</Button>
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
        if (role.roleId === 2) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 11)}>提交货权转移证明</Button>
          </div>
        } else if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 11)}>帮供应商提交货权转移证明</Button>
          </div>
        } else if (role.roleId === 7) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 5)}>确认货权转移</Button>
          </div>
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 4) {
        if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={payStatus === 0 ? false : true} onClick={this.handle.bind(this, 16, null, 2)}>提交委托付款函</Button>
            <Button type="primary" disabled={payStatus === 0 ? true : false} onClick={this.handle.bind(this, 3, null)}>提交付款证明</Button>
          </div>
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 5) {
        if (role.roleId === 2) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 8, 0)}>提交开票证明</Button>
          </div>
        } else if (role.roleId === 10) {
          if (orderInfo.submitStatus) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 5)}>确认发票</Button>
            </div>
          } else {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 8, 0)}>帮供应商提交开票证明</Button>
            </div>
          }
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 6) {
        if (role.roleId === 1) {
          if (orderInfo.submitStatus === 1) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={true}>等待对方确认</Button>
            </div>
          } else {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" onClick={this.handle.bind(this, 14)}>申请提货</Button>
              <Button type="primary" onClick={this.handle.bind(this, 15)}>申请延期提货</Button>
            </div>
          }
        } else if (role.roleId === 10 || role.roleId === 11 || role.roleId === 12) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 6)}>审核提货申请</Button>
          </div>
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 7) {
        if (role.roleId === 4 || role.roleId === 5 || role.roleId === 6 || role.roleId === 7 || role.roleId === 8) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 7)}>审核延期提货申请</Button>
          </div>
        } else if (role.roleId === 14) {
          if (orderInfo.quota && orderInfo.quota > 5000000) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" onClick={this.handle.bind(this, 7)}>审核延期提货申请</Button>
            </div>
          } else {
            return <div className={styles.btnBox}></div>
          }
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 8) {
        if (role.roleId === 7) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 4)}>提交放货证明</Button>
          </div>
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 9) {
        if (role.roleId === 1 || role.roleId === 2) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 10)}>编辑结算单</Button>
          </div>
        } else if (role.roleId === 10) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" onClick={this.handle.bind(this, 10)}>编辑结算单</Button>
            <Button type="primary" disabled={orderInfo.auditStatus ? true : false} onClick={this.handle.bind(this, 12)}>审核结算单</Button>
          </div>
        } else if (role.roleId === 11 || role.roleId === 12) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.auditStatus ? true : false} onClick={this.handle.bind(this, 12)}>审核结算单</Button>
          </div>
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 10) {
        if (role.roleId === 2) {
          return <div className={styles.btnBox}>
            <Button onClick={() => router.goBack()}>返 回</Button>
            <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 8, 0)}>提交开票证明</Button>
          </div>
        } else if (role.roleId === 10) {
          if (orderInfo.submitStatus) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderInfo.submitStatus === 0 ? true : false} onClick={this.handle.bind(this, 5)}>确认发票</Button>
              <Button type="primary" onClick={() => {
                Modal.confirm({
                  title: '请确认四川金密是否收到服务费？',
                  content: '若没有收到服务费请取消操作',
                  okText: '继续',
                  cancelText: '取消',
                  onOk: () => this.handle(8, 1)
                });
              }}>提交开票证明</Button>
            </div>
          } else {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" disabled={orderInfo.submitStatus === 1 ? true : false} onClick={this.handle.bind(this, 8, 0)}>帮供应商提交开票证明</Button>
              <Button type="primary" onClick={() => {
                Modal.confirm({
                  title: '请确认四川金密是否收到服务费？',
                  content: '若没有收到服务费请取消操作',
                  okText: '继续',
                  cancelText: '取消',
                  onOk: () => this.handle(8, 1)
                });
              }}>提交开票证明</Button>
            </div>
          }
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else if (orderInfo.orderStatus === 13 && role.roleId === 10) {
        if (orderInfo.retreatFillType) {
          if (orderInfo.retreatFillType.indexOf(',') > -1) {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              {
                orderInfo.retreatFillType.split(',').map(key =>
                  <Button type="primary" onClick={this.handle.bind(this, 3, key)} key={key}>{
                    key === '1' ? '委托企业付款' :
                      key === '2' ? '委托企业收款' :
                        key === '3' ? '供应商收款' : '供应商付款'
                  }</Button>
                )
              }
            </div>
          } else {
            return <div className={styles.btnBox}>
              <Button onClick={() => router.goBack()}>返 回</Button>
              <Button type="primary" onClick={this.handle.bind(this, 3, orderInfo.retreatFillType)}>{
                orderInfo.retreatFillType === '1' ? '委托企业付款' :
                  orderInfo.retreatFillType === '2' ? '委托企业收款' :
                    orderInfo.retreatFillType === '3' ? '供应商收款' : '供应商付款'
              }</Button>
            </div>
          }
        } else {
          return <div className={styles.btnBox}></div>
        }
      } else {
        return <div className={styles.btnBox}></div>
      }
    } else {
      if (type === 'settlement') {
        if (role.roleId === 10 || role.roleId === 11 || role.roleId === 12) {
          if (orderInfo.auditStatus) {
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
          return <div className={styles.btnBox}></div>
        }
      } else {
        return <div className={styles.btnBox}></div>
      }
    }
  }

  showConfirm = () => {
    Modal.confirm({
      title: '请确认所有审核意见',
      content: '提交后将无法修改任何信息',
      okText: '继续',
      cancelText: '取消',
      onOk: this.passOk
    })
  }

  passOk = () => {
    const { dispatch } = this.props;
    const { orderInfo } = this.props.detail;
    const { type } = this.props.location.query;

    if (type === 'settlement') {
      let params = {
        orderId: orderInfo.buyOrdersId,
        isPass: 1, // 是否通过，0否，1是
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
  }

  returnOk = () => {
    const { dispatch } = this.props;
    const { orderInfo } = this.props.detail;
    const { validateFields } = this.props.form;
    const { type } = this.props.location.query;
    validateFields((err, values) => {
      if (!err && type === 'settlement') {
        let params = {
          orderId: orderInfo.buyOrdersId,
          isPass: 0, // 是否通过，0否，1是
          refusedType: values.refusedType, // 拒绝的结算单类型，0销售结算单，1采购结算单，2全部
          recentlyReason: values.recentlyReason, // 驳回原因
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
    const { visible, edit } = this.state;
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
                      type === 'deferred' ? '延期提货申请' :
                        type === 'contract' ? '合同审核' :
                          type === 'settlement' ? '结算审核' :
                            type === 'goods' ? '提货申请' :
                              type === 'warehouse' ? '仓单审核' :
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
                  <span>委托采购</span>
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
                  // 委托采购，且角色为核心企业时，隐藏剩余金额
                  role.roleId === 2 ?
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
                  // 只有委托采购，且角色为核心企业时，隐藏已提数量
                  role.roleId === 2 ?
                    null :
                    <div>
                      <span>已提数量：</span>
                      <span>{orderInfo.extractAlready !== undefined && orderInfo.extractAlready !== null ? orderInfo.extractAlready + '吨' : '无'}</span>
                    </div>
                }
                {
                  // 委托采购，核心企业隐藏
                  role.roleId === 2 ?
                    null :
                    <div>
                      <span>{
                        // 委托采购且是委托企业时，更改为已付款金额
                        role.roleId === 1 ? '已付款金额' : '已回款金额'
                      }：</span>
                      <span>{orderInfo.payAlready !== undefined && orderInfo.payAlready !== null ? orderInfo.payAlready + '元' : '无'}</span>
                    </div>
                }
                {
                  // 委托采购，核心企业隐藏
                  role.roleId === 2 ?
                    null :
                    <div>
                      <span>{
                        // 委托采购且是委托企业时，更改为已收票金额
                        role.roleId === 1 ? '已收票金额' : '已开票金额'
                      }：</span>
                      <span>{orderInfo.invoiceAlready !== undefined && orderInfo.invoiceAlready !== null ? orderInfo.invoiceAlready + '元' : '无'}</span>
                    </div>
                }
              </div>
              <div className={styles.row}>
                <div>
                  <span>供货方：</span>
                  <span>{orderInfo.supplyCompanyName ? orderInfo.supplyCompanyName : '无'}</span>
                </div>
                {
                  // 只有委托采购，且角色为核心企业时，隐藏未提数量
                  role.roleId === 2 ?
                    null :
                    <div>
                      <span>未提数量：</span>
                      <span>{orderInfo.extractNot !== undefined && orderInfo.extractNot !== null ? orderInfo.extractNot + '吨' : '无'}</span>
                    </div>
                }
                {
                  role.roleId === 1 || role.roleId === 2 || role.roleId === 3 ?
                    null :
                    <div>
                      <span>已付款金额：</span>
                      <span>{orderInfo.payment !== undefined && orderInfo.payment !== null ? orderInfo.payment + '元' : '无'}</span>
                    </div>
                }
                {
                  // 委托采购，委托企业隐藏
                  role.roleId === 1 ?
                    null :
                    <div>
                      <span>{
                        // 委托采购且是核心企业时，更改为已收票金额
                        role.roleId === 2 ? '已开票金额' : '已收票金额'
                      }：</span>
                      <span>{orderInfo.invoiceNot !== undefined && orderInfo.invoiceNot !== null ? orderInfo.invoiceNot + '元' : '无'}</span>
                    </div>
                }
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {
              orderInfo.frozenStatus !== 0 ? this.setBuyButton() : <div className={styles.btnBox}></div>
            }
            <div className={styles.stateBox} style={{ flex: 1 }}>
              <div className={styles.item}>
                <span>状态</span>
                <span>{
                  orderInfo.frozenStatus !== 0 ? (
                    orderInfo.orderStatus !== undefined && orderInfo.orderStatus !== null ? (
                      orderInfo.orderStatus === 0 ? '签订委托合同' :
                        orderInfo.orderStatus === 1 ? '提交保证金' :
                          orderInfo.orderStatus === 2 ? '签订采购合同' :
                            orderInfo.orderStatus === 3 ? '转移货权' :
                              orderInfo.orderStatus === 4 ? '支付货款' :
                                orderInfo.orderStatus === 5 ? '供应商开票' :
                                  orderInfo.orderStatus === 6 ? '回款提货' :
                                    orderInfo.orderStatus === 7 ? '延期申请中' :
                                      orderInfo.orderStatus === 8 ? '等待放货' :
                                        orderInfo.orderStatus === 9 ? '结算确认' :
                                          orderInfo.orderStatus === 10 ? '开票收票' :
                                            orderInfo.orderStatus === 11 ? '冻结中' :
                                              orderInfo.orderStatus === 12 ? '已完成' :
                                                orderInfo.orderStatus === 13 ? '多退少补' : '无'
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

        <Modal
          title="退回原因"
          visible={visible}
          onOk={this.returnOk}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form layout='inline'>
            {
              type === 'settlement' && <FormItem label='退回结算'>
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
            }
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
      </div>
    )
  }
}