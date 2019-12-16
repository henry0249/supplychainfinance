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
@connect(({ global, detail, loading }) => ({
  global,
  detail,
  loading: loading.effects
}))
export default class Index extends Component {
  state = {
    edit: false
  }

  getData = () => {
    const { dispatch } = this.props;
    const { orderId } = this.props.location.query;
    // 获取订单详情
    dispatch({
      type: 'detail/getOrderInfo',
      payload: orderId
    })
  }

  // 触发方法
  handle = () => {
    const { dispatch } = this.props;
    const { orderInfo } = this.props.detail;
    let orderId = orderInfo.largeBuyOrdersId;
    let self = this;

    Modal.confirm({
      title: '确定终止发货',
      content: '终止发货后无法撤回，是否要继续？',
      onOk() {
        dispatch({
          type: 'bill/stopShip',
          payload: orderId,
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
  }

  setBuyButton = () => {
    const { role } = this.props.global;
    const { orderInfo } = this.props.detail;
    const { enterType } = this.props.location.query;

    if (enterType === "1" && orderInfo.orderStatus === 3 && role.roleId === 10) {
      return <div className={styles.btnBox}>
        <Button onClick={() => router.goBack()}>返 回</Button>
        <Button type="primary" onClick={this.handle.bind(this)}>终止发货</Button>
      </div>
    } else {
      return <div className={styles.btnBox}></div>
    }
  }

  saveModeName = () => {
    const { dispatch } = this.props;
    const { validateFields } = this.props.form;
    const { orderId } = this.props.location.query;
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
          orderBusinessId: orderId
        }

        dispatch({
          type: 'detail/saveModeName',
          payload: params,
          success: () => {
            // 获取订单详情
            dispatch({
              type: 'detail/getOrderInfo',
              payload: orderId,
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
    const { enterType, type } = this.props.location.query;
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
                  <span>大企业委托采购</span>
                </div>
                <div>
                  <span>货品：</span>
                  <span style={{ color: "#1890ff" }}>{orderInfo.goodsName !== undefined && orderInfo.goodsName !== null ? orderInfo.goodsName : '无'}</span>
                </div>
                <div>
                  <span>占用资金：</span>
                  <span>{orderInfo.occupyAmount !== undefined && orderInfo.occupyAmount !== null ? orderInfo.occupyAmount + '元' : '无'}</span>
                </div>
                <div>
                  <span>未回货款：</span>
                  <span>{orderInfo.payRemain !== undefined && orderInfo.payRemain !== null ? orderInfo.payRemain + '元' : '无'}</span>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <span>委托企业：</span>
                  <span>{orderInfo.entrustCompanyName !== undefined && orderInfo.entrustCompanyName !== null ? orderInfo.entrustCompanyName : '无'}</span>
                </div>
                <div>
                  <span>已回款金额：</span>
                  <span>{orderInfo.payAlready !== undefined && orderInfo.payAlready !== null ? orderInfo.payAlready + '元' : '无'}</span>
                </div>
                <div>
                  <span>已开票金额：</span>
                  <span>{orderInfo.invoiceAlready !== undefined && orderInfo.invoiceAlready !== null ? orderInfo.invoiceAlready + '元' : '无'}</span>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <span>供货方：</span>
                  <span>{orderInfo.supplyCompanyName ? orderInfo.supplyCompanyName : '无'}</span>
                </div>
                {
                  role.roleId === 1 || role.roleId === 2 || role.roleId === 3 ?
                    null :
                    <div>
                      <span>已付款金额：</span>
                      <span>{orderInfo.payment !== undefined && orderInfo.payment !== null ? orderInfo.payment + '元' : '无'}</span>
                    </div>
                }
                <div>
                  <span>已收票金额：</span>
                  <span>{orderInfo.invoiceNot !== undefined && orderInfo.invoiceNot !== null ? orderInfo.invoiceNot + '元' : '无'}</span>
                </div>
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
                      orderInfo.orderStatus === 0 ? '签订销售合同' :
                        orderInfo.orderStatus === 1 ? '提交保证金' :
                          orderInfo.orderStatus === 2 ? '签订采购合同' :
                            orderInfo.orderStatus === 3 ? '转移货权' :
                              orderInfo.orderStatus === 4 ? '终止发货' :
                                orderInfo.orderStatus === 5 ? '冻结中' :
                                  orderInfo.orderStatus === 6 ? '已完成' : '无'
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