import React, { Component } from 'react';
import styles from './index.less';
import { Collapse, Button, Modal, message, Table, Form, Input, Icon } from 'antd';
import { connect } from 'dva';
import withRouter from "umi/withRouter";
import InvoiceModal from './components/invoiceModal/index';
import PaymentModal from './components/paymentModal/index';
import LetterModal from './components/letterModal/index';
import pdf from '@/assets/pdf.png';
import zip from '@/assets/zip.png';

const FormItem = Form.Item;
const { TextArea } = Input;
const Panel = Collapse.Panel;
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
}];

// 王尧 - 票据组件
@withRouter
@Form.create()
@connect(({ global, detail, bill, loading }) => ({
  global,
  detail,
  bill,
  loading: loading.effects
}))
export default class Bill extends Component {
  state = {
    activeKeys: [],
    type: '', // 退回证明类型
    id: '', // 退回证明业务ID
    modalId: null,
    visible: false, // 退回modal
    visibleInvoice: false, // 提交开票证明modal
    visiblePayment: false, // 提交付款证明modal
    visibleLetter: false, // 提交委托付款函证明modal
    billInvoiceType: null, //开票类型
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    const { enterType, id } = this.props.location.query;
    let { activeKeys } = this.state;
    // 获取订单详情
    dispatch({
      type: 'detail/getChildOrderInfo',
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
    })
    // 获取所有类型票据
    dispatch({
      type: 'bill/getInfo',
      payload: id,
      success: (data) => {
        data && Object.keys(data).forEach(key => {
          key && data[key] && data[key].forEach((i, index) => {
            // 只是默认展开待审核、已退回的
            if (i.isPass !== 1) {
              activeKeys.push(key + "_" + index);
            }
          })
        });
        this.setState({
          activeKeys
        });
      },
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
    if (enterType === '1') {
      dispatch({
        type: 'bill/getChildLogs',
        payload: `${id}&currentPage=1&pageSize=20`,
        error: (msg) => {
          message.error('获取票据操作日志失败：' + msg);
        }
      })
    }
  }

  confirmBill = (type, id, e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    if (type === 'invoice') {
      // 确认开票接口
      dispatch({
        type: 'check/confirmInvoice',
        payload: {
          invoiceBusinessId: id
        },
        success: () => {
          this.getData();
          message.success("确认开票证明成功");
        },
        error: (msg) => {
          message.error('确认开票证明失败：' + msg);
        }
      })
    } else if (type === 'payment') {
      // 确认付款证明接口
      dispatch({
        type: 'check/paymentSure',
        payload: {
          paymentBusinessId: id
        },
        success: () => {
          this.getData();
          message.success("确认放款证明成功");
        },
        error: (msg) => {
          message.error('确认放款证明失败：' + msg);
        }
      })
    }
  }

  showReturnModal = (type, id, e) => {
    e.stopPropagation();
    this.setState({
      type,
      id,
      visible: true
    })
  }

  return = () => {
    const { dispatch } = this.props;
    const { validateFields } = this.props.form;
    const { type, id } = this.state;
    validateFields((err, values) => {

      if (!err) {
        if (type === 'invoice') {
          // 退回开票证明
          let params = {
            invoiceBusinessId: id, // 发票业务ID
            refuseReason: values.recentlyReason // 发票退回原因
          }
          dispatch({
            type: 'check/returnInvoice',
            payload: params,
            success: () => {
              this.getData();
              this.setState({
                visible: false,
              }, () => {
                message.success('退回开票证明成功');
              })
            },
            error: (msg) => {
              this.setState({
                visible: false,
              }, () => {
                message.error('退回开票证明失败：' + msg);
              })
            }
          })
        } else if (type === 'payment') {
          // 退回放款证明
          let params = {
            paymentBusinessId: id, // 放款证明业务ID
            recentlyReason: values.recentlyReason // 发票退回原因
          }
          dispatch({
            type: 'check/paymentReturn',
            payload: params,
            success: () => {
              this.getData();
              this.setState({
                visible: false,
              }, () => {
                message.success('退回放款证明成功');
              })
            },
            error: (msg) => {
              this.setState({
                visible: false,
              }, () => {
                message.error('退回放款证明失败：' + msg);
              })
            }
          })
        }
      }
    })
  }

  showModal = (key, id, billInvoiceType, e) => {
    this.setState({
      [key]: true,
      modalId: id,
      billInvoiceType
    })
  }

  handlePreview = (file) => {
    // 预览票据文件
    let url = '';
    if (file.name.indexOf('.rar') > -1 || file.name.indexOf('.zip') > -1) {
      return message.warning('压缩文件暂不支持预览');
    } else {
      url = file.response.data.access_url;
    }
    // console.log(file)
    window.open(url)
  }

  // 用于重置modalKey、modalId的组件回调
  callback = (key) => {
    const { onHideModal } = this.props;
    onHideModal && onHideModal();
    this.setState({
      [key]: false,
      modalId: null
    })
  }

  // 票据操作日志的分页回调
  onChange = (current) => {
    const { dispatch } = this.props;
    const { id } = this.props.location.query;
    dispatch({
      type: 'bill/getChildLogs',
      payload: `${id}&currentPage=${current}&pageSize=20`,
      error: (msg) => {
        message.error('获取票据操作日志失败：' + msg);
      }
    })
  }

  render() {
    const { modalKey, invoiceType } = this.props;
    const { role } = this.props.global;
    const { orderChildInfo } = this.props.detail;
    const { data, refusedInfo, childLogs, childLogsPages } = this.props.bill;
    const { getFieldDecorator } = this.props.form;
    const { enterType, id } = this.props.location.query;
    const {
      activeKeys,
      modalId,
      visible,
      visibleInvoice,
      visiblePayment,
      visibleLetter,
      billInvoiceType,
    } = this.state;

    let empty = true;
    data && Object.keys(data).forEach(key => {
      if (data[key].length !== 0) {
        empty = false;
      }
    })

    return (
      <div className={styles.container}>
        {
          refusedInfo && Object.keys(refusedInfo).length !== 0 && Object.keys(refusedInfo).map(key => {
            let row = refusedInfo[key].map((i, index) => {
              let modalKey = null, id = null;
              modalKey = key === 'invoiceRefusedDTO' ? 'visibleInvoice' :
                key === 'paymentProofRefusedDTO' ? 'visiblePayment' : null;
              id = key === 'invoiceRefusedDTO' ? i.invoiceBusinessId : null;
              return (
                <div className={styles.backInfo} key={index}>
                  <Icon type="exclamation-circle" style={{ color: '#FAAD14', fontSize: 24 }} />
                  <div className={styles.detailsBox}>
                    <span style={{ fontSize: 16 }}>请注意！您提交的{
                      key === 'invoiceRefusedDTO' ? '发票' :
                        key === 'paymentProofRefusedDTO' ? '付款证明' : '未知票据'
                    }被退回，请重新提交</span>
                    <div className={styles.details}>
                      <span>退回原因：</span>
                      <div className={styles.text}>
                        <pre>{i.recentlyReason}</pre>
                      </div>
                    </div>
                    {
                      orderChildInfo.frozenStatus !== 0 ? (
                        sessionStorage.businessMode === '1' ? (
                          key === 'paymentProofRefusedDTO' ? (
                            orderChildInfo.orderStatus === 5 || orderChildInfo.orderStatus === 10 ? (
                              role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新提交</span> : null
                            ) : (
                                role.roleId === 2 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新提交</span> : null
                              )
                          ) :
                            key === 'invoiceRefusedDTO' ? (
                              orderChildInfo.orderStatus === 4 || orderChildInfo.orderStatus === 9 ? (
                                role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新提交</span> : null
                              ) : (
                                  role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新提交</span> : null
                                )
                            ) : null
                        ) : (
                            key === 'paymentProofRefusedDTO' ? (
                              orderChildInfo.orderStatus === 0 ? (
                                role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新提交</span> : null
                              ) : (
                                  role.roleId === 1 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id)}>重新提交</span> : null
                                )
                            ) :
                              key === 'invoiceRefusedDTO' ? (
                                orderChildInfo.orderStatus === 3 ? (
                                  role.roleId === 2 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新提交</span> : null
                                ) : (
                                    role.roleId === 10 ? <span className={styles.btn} onClick={this.showModal.bind(this, modalKey, id, 0)}>重新提交</span> : null
                                  )
                              ) : null
                          )
                      ) : null
                    }
                  </div>
                </div>
              )
            })
            return row
          })
        }

        {
          modalKey === 'visibleInvoice' || visibleInvoice ? <InvoiceModal
            id={modalId}
            orderBusinessId={id}
            invoiceType={invoiceType !== null ? invoiceType : billInvoiceType} //开票类型 必传
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        {
          modalKey === 'visiblePayment' || visiblePayment === true ? <PaymentModal
            id={modalId}
            orderBusinessId={id}
            retreatFillType={invoiceType}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        {
          modalKey === 'visibleLetter' || visibleLetter ? <LetterModal
            orderBusinessId={id}
            refreshData={this.getData} //订单详情的用于刷新数据，订单管理列表里面不用传
            callback={this.callback}
            preview={this.handlePreview}
          /> : null
        }

        <div className={styles.content}>
          {
            empty ? <p className={styles.empty}>暂无可查看票据</p> :
              <Collapse defaultActiveKey={activeKeys}>
                {
                  data && Object.keys(data).map(key => {
                    // invoiceDTO 开票证明（发票）
                    // paymentProofDTO 付款证明
                    // 是否通过（0.未通过 1.通过 2.审核中）
                    let row = data[key].map((i, index) => {
                      let modalKey = null, id = null;
                      modalKey = key === 'invoiceDTO' ? 'visibleInvoice' :
                        key === 'goodsPowerTransferProofRefusedDTO' ? 'visibleTransfer' :
                          key === 'paymentProofDTO' ? 'visiblePayment' : null
                      id = key === 'invoiceDTO' ? i.invoiceBusinessId :
                        key === 'goodsPowerTransferProofDTO' ? i.goodsPowerBusinessId :
                          key === 'paymentProofDTO' ? i.paymentBusinessId : null
                      return (
                        <Panel header={
                          <div className={styles.header}>
                            票据： {
                              key === 'invoiceDTO' ? '发票' :
                                key === 'goodsPowerTransferProofDTO' ? '货权转移证明' :
                                  key === 'payLetterDTO' ? '委托付款函' :
                                    key === 'paymentProofDTO' ? '付款证明' : null
                            }
                            <span style={i.isPass === 0 ? { color: '#FF6347' } : i.isPass === 2 ? { color: '#de9d5b' } : { color: '#5bbd5b' }}>{
                              i.isPass === 0 ? ' （被退回）' : i.isPass === 2 ? ' （待确定）' : ' （已通过）'
                            }</span>
                            {
                              orderChildInfo.frozenStatus !== 0 ? (
                                key === 'invoiceDTO' ? (
                                  role.roleId === 10 && i.isPass === 2 && <div className={styles.btnBox}>
                                    <Button onClick={this.showReturnModal.bind(this, 'invoice', i.invoiceBusinessId)}>退回</Button>
                                    <Button onClick={this.confirmBill.bind(this, 'invoice', i.invoiceBusinessId)} type="primary">确认票据</Button>
                                  </div>
                                ) :
                                  key === 'paymentProofDTO' ? (
                                    role.roleId === 10 && i.isPass === 2 && <div className={styles.btnBox}>
                                      <Button onClick={this.showReturnModal.bind(this, 'payment', i.paymentBusinessId)}>退回</Button>
                                      <Button onClick={this.confirmBill.bind(this, 'payment', i.paymentBusinessId)} type="primary">确认票据</Button>
                                    </div>
                                  ) : null
                              ) : null
                            }
                          </div>
                        } key={key + "_" + index}>
                          <div className={styles.infoBox}>
                            {
                              key === 'payLetterDTO' ? null :
                                key === 'goodsPowerTransferProofDTO' ?
                                  <span>放货公司：{i.transferCompany !== undefined ? i.transferCompany : '无'}</span> :
                                  <span>提交公司：{
                                    i.freightForwardingCompany !== undefined ? i.freightForwardingCompany :
                                      i.entrustCompany !== undefined ? i.entrustCompany :
                                        i.deliverCompany !== undefined ? i.deliverCompany :
                                          i.invoiceCompany !== undefined ? i.invoiceCompany :
                                            i.paymentCompany !== undefined ? i.paymentCompany : '无'}</span>
                            }
                            {
                              key === 'paymentProofDTO' ? <span>收款公司：{i.receiveCompanyName !== undefined ? i.receiveCompanyName : '无'}</span> : null
                            }
                            {
                              key === 'goodsPowerTransferProofDTO' ? <span>货物数量：{i.goodsAmount !== undefined ? i.goodsAmount : '无'}</span> : null
                            }
                            {
                              key === 'invoiceDTO' || key === 'paymentProofDTO' ?
                                <span>{
                                  key === 'invoiceDTO' ? '开票金额' :
                                    key === 'paymentProofDTO' ? '放款金额' : '金额'
                                }：{
                                    i.invoiceMoney !== undefined ? i.invoiceMoney :
                                      i.paymentMoney !== undefined ? i.paymentMoney : '无'}元</span> : null
                            }
                            {
                              key === 'invoiceDTO' ?
                                <span>开票比例：{i.invoiceRatio !== undefined ? i.invoiceRatio + '%' : '无'}</span> : null
                            }
                            {
                              key === 'invoiceDTO' ?
                                <span>开票数量：{i.invoiceQuantity !== undefined ? i.invoiceQuantity + '吨' : '无'}</span> : null
                            }
                            {
                              <span>备注：{i.remark ? i.remark : '无'}</span>
                            }
                          </div>
                          <div className={styles.imgBox}>
                            {
                              i.files && i.files.map((url, index) =>
                                url.url ? (
                                  url.url.indexOf('.rar') > -1 || url.url.indexOf('.zip') > -1 ?
                                    <a style={{ width: 160, height: 160 }} href={url.url} key={index}>
                                      <Icon className={styles.download} type="download" />
                                      <img className={styles.logo} src={zip} alt="图片" />
                                    </a> :
                                    url.url.indexOf('.pdf') > -1 ?
                                      <a style={{ width: 160, height: 160 }} onClick={() => window.open(url.url)} key={index}>
                                        <Icon className={styles.download} type="zoom-in" />
                                        <img className={styles.logo} src={pdf} alt="图片" />
                                      </a> :
                                      <a style={{ width: 240, height: 160 }} onClick={() => window.open(url.url)} key={index}>
                                        <Icon className={styles.download} type="zoom-in" />
                                        <img className={styles.img} src={url.url} alt="图片" />
                                      </a>
                                ) : null
                              )
                            }
                            {
                              orderChildInfo.frozenStatus !== 0 ? (
                                i.isPass === 0 || i.isPass === 2 ? (
                                  key === 'paymentProofDTO' ? (
                                    orderChildInfo.orderStatus === 5 || orderChildInfo.orderStatus === 10 ? (
                                      role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新提交</span> : null
                                    ) : (
                                        role.roleId === 2 ? <span onClick={this.showModal.bind(this, modalKey, id)}>重新提交</span> : null
                                      )
                                  ) :
                                    key === 'invoiceDTO' ? (
                                      orderChildInfo.orderStatus === 4 || orderChildInfo.orderStatus === 9 ? (
                                        role.roleId === 1 ? <span onClick={this.showModal.bind(this, modalKey, id, 0)}>重新提交</span> : null
                                      ) : (
                                          role.roleId === 10 ? <span onClick={this.showModal.bind(this, modalKey, id, 0)}>重新提交</span> : null
                                        )
                                    ) : null
                                ) : null
                              ) : null
                            }
                          </div>
                        </Panel>
                      )
                    })
                    return row
                  })
                }
              </Collapse>
          }
        </div>

        {
          enterType === '1' && role.roleId !== 1 && role.roleId !== 2 && role.roleId !== 3 && <div className={styles.logBox}>
            <span className={styles.title}>操作日志</span>
            <div className={styles.tableBox}>
              <Table
                rowKey={(row, i) => row.operateId + '_' + i}
                dataSource={childLogs}
                columns={columns}
                pagination={{
                  defaultCurrent: 1,
                  defaultPageSize: 20,
                  pageSize: childLogsPages.pageSize,
                  current: childLogsPages.currentPage,
                  total: childLogsPages.totalRecords,
                  onChange: this.onChange.bind(this),
                }} />
            </div>
          </div>
        }

        <Modal
          title="退回原因"
          visible={visible}
          onOk={this.return}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form layout='inline'>
            <FormItem label='退回原因'>
              {getFieldDecorator('recentlyReason', {
                rules: [{
                  required: true, message: '请输入退回原因',
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